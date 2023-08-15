import { FC, useEffect, useState } from 'react'
import { Anchor, Box, Button, ErrorWell, Flex, Text } from '../primitives'
import { Token } from './SelectTokenModal'
import { erc20ABI, mainnet, useAccount, useNetwork } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Modal } from '../common/Modal'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allChains from 'viem/chains'
import { truncateAddress } from '../../utils/truncate'
import {
  createPublicClient,
  http,
  parseUnits,
  zeroAddress,
  encodeFunctionData,
  parseAbiItem,
  encodeAbiParameters,
  parseAbiParameters,
  Address,
  formatUnits,
} from 'viem'
import {
  signTypedData,
  sendTransaction,
  readContract,
  waitForTransaction,
} from '@wagmi/core'
import { useToast } from '../../hooks/useToast'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { IntentInfo } from './IntentInfo'
import { useMounted } from '../../hooks'

type FetchBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

enum SwapStep {
  Error,
  Signing,
  Submitting,
  MetamaskApproving,
  Complete,
}

type Props = {
  tokenIn?: Token
  tokenOut?: Token
  tokenInBalance?: FetchBalanceResult
  amountIn: string
  amountOut: string
  isFetchingQuote: boolean
  errorFetchingQuote: boolean
}

const MEMSWAP = '0x90d4ecf99ad7e8ac74994c5181ca78b279ca9f8e'
const WETH2 = '0xe6ea2a148c13893a8eedd57c75043055a8924c5f'

export const SwapModal: FC<Props> = ({
  tokenIn,
  tokenOut,
  tokenInBalance,
  amountIn,
  amountOut,
  isFetchingQuote,
  errorFetchingQuote,
}) => {
  const isMounted = useMounted()
  const { chain: activeChain } = useNetwork()
  const { address, isDisconnected, isConnecting, connector } = useAccount()
  const { openConnectModal } = useConnectModal()

  const [open, setOpen] = useState(false)
  const [swapStep, setSwapStep] = useState<SwapStep>(SwapStep.Complete)
  const [error, setError] = useState<Error | undefined>()
  const [txHash, setTxHash] = useState<string | undefined>()

  const { toast } = useToast()

  const viemChain =
    Object.values(allChains).find(
      (chain) => chain.id === (activeChain?.id || 1)
    ) || mainnet

  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(),
  })

  const isMetamaskWallet = connector?.id === 'metaMask'

  // Reset state on modal close
  useEffect(() => {
    if (!open) {
      setSwapStep(SwapStep.Signing)
      setError(undefined)
    }
  }, [open])

  // Execute Swap
  const swap = async () => {
    if (!address) {
      throw Error('No wallet connected')
    }
    try {
      const parsedAmountIn = parseUnits(amountIn, tokenIn?.decimals || 18)
      const parsedAmountOut = parseUnits(amountOut, tokenOut?.decimals || 18)

      const processedTokenIn =
        tokenIn?.address === zeroAddress ? WETH2 : (tokenIn?.address as Address)

      // Create Intent
      const intent: any = {
        maker: address,
        filler: zeroAddress,
        tokenIn: processedTokenIn,
        tokenOut: tokenOut?.address,
        referrer: zeroAddress,
        referrerFeeBps: 0,
        referrerSurplusBps: 0,
        deadline: await publicClient
          .getBlock()
          .then((b) => Number(b!.timestamp) + 3600 * 24),
        amountIn: parsedAmountIn,
        // @TODO: configure slippage settings
        startAmountOut: parsedAmountOut,
        expectedAmountOut: parsedAmountOut,
        endAmountOut: parsedAmountOut,
      }

      intent.signature = await signTypedData({
        domain: {
          name: 'Memswap',
          version: '1.0',
          chainId: activeChain?.id || 1,
          verifyingContract: MEMSWAP,
        },
        types: {
          Intent: [
            {
              name: 'maker',
              type: 'address',
            },
            {
              name: 'filler',
              type: 'address',
            },
            {
              name: 'tokenIn',
              type: 'address',
            },
            {
              name: 'tokenOut',
              type: 'address',
            },
            {
              name: 'referrer',
              type: 'address',
            },
            {
              name: 'referrerFeeBps',
              type: 'uint32',
            },
            {
              name: 'referrerSurplusBps',
              type: 'uint32',
            },
            {
              name: 'deadline',
              type: 'uint32',
            },
            {
              name: 'amountIn',
              type: 'uint128',
            },
            {
              name: 'startAmountOut',
              type: 'uint128',
            },
            {
              name: 'expectedAmountOut',
              type: 'uint128',
            },
            {
              name: 'endAmountOut',
              type: 'uint128',
            },
          ],
        },
        message: intent,
        primaryType: 'Intent',
      })

      // Encode approval and intent
      const approveMethod =
        processedTokenIn === WETH2 ? 'depositAndApprove' : 'approve'

      const approveAbiItem = parseAbiItem(
        `function ${approveMethod}(address spender, uint256 amount)`
      )

      const encodedApprovalData = encodeFunctionData({
        abi: [approveAbiItem],
        args: [MEMSWAP, parsedAmountIn],
      })

      const encodedIntentData = encodeAbiParameters(
        parseAbiParameters([
          'address',
          'address',
          'address',
          'address',
          'address',
          'uint32',
          'uint32',
          'uint32',
          'uint128',
          'uint128',
          'uint128',
          'uint128',
          'bytes',
        ]),
        // @ts-ignore - @TODO: add types
        [
          intent.maker,
          intent.filler,
          intent.tokenIn,
          intent.tokenOut,
          intent.referrer,
          intent.referrerFeeBps,
          intent.referrerSurplusBps,
          intent.deadline,
          intent.amountIn,
          intent.startAmountOut,
          intent.expectedAmountOut,
          intent.endAmountOut,
          (intent as any).signature,
        ]
      )

      const combinedEndcodedData =
        encodedApprovalData + encodedIntentData.slice(2)

      // Fetch allowance amount
      const allowanceAmount = await readContract({
        address: processedTokenIn,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, MEMSWAP],
      })

      console.log('Allowance: ', allowanceAmount, parsedAmountIn)

      // Handle transactions

      // If user already approved for amountIn
      if (allowanceAmount >= parsedAmountIn) {
        setSwapStep(SwapStep.Submitting)
        const { hash } = await sendTransaction({
          chainId: activeChain?.id,
          to: address,
          account: address,
          data: encodedIntentData,
        })

        setTxHash(hash)

        const data = await waitForTransaction({
          hash: hash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
        })

        console.log('Data: ', data)
      }
      // if metamask wallet
      else if (isMetamaskWallet) {
        setSwapStep(SwapStep.MetamaskApproving)
        console.log('Metamask wallet flow')

        // For metamask, an extra tx is required due to custom approval handling
        const { hash: approvalHash } = await sendTransaction({
          chainId: activeChain?.id,
          to: processedTokenIn,
          account: address,
          value: 0n,
          data: encodedApprovalData,
        })

        setTxHash(approvalHash)

        const approvalTransactionData = await waitForTransaction({
          hash: approvalHash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
        })

        console.log(approvalTransactionData)

        setTxHash(undefined)

        setSwapStep(SwapStep.Submitting)

        const { hash: intentHash } = await sendTransaction({
          chainId: activeChain?.id,
          to: address,
          account: address,
          value: 0n,
          data: encodedIntentData,
        })

        setTxHash(intentHash)

        const intentTransactionData = await waitForTransaction({
          hash: intentHash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
        })

        console.log(intentTransactionData)
      }
      //
      else {
        setSwapStep(SwapStep.Submitting)
        const { hash } = await sendTransaction({
          chainId: activeChain?.id,
          to: processedTokenIn,
          account: address,
          value: approveMethod === 'depositAndApprove' ? parsedAmountIn : 0n,
          data: combinedEndcodedData as Address,
        })

        setTxHash(hash)

        const data = await waitForTransaction({
          hash: hash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
        })
      }

      setSwapStep(SwapStep.Complete)
      toast({
        title: 'Transaction was successful.',
      })
    } catch (error: any) {
      setSwapStep(SwapStep.Error)
      setError(error)
      console.error(error)
      if (error?.code === 4001) {
        toast({
          title: 'User rejected the transaction.',
        })
      } else {
        toast({
          title: 'Oops, something went wrong.',
        })
      }
    }
  }

  const trigger = (
    <Button
      color="primary"
      css={{ justifyContent: 'center' }}
      onClick={() => {
        if (isDisconnected) {
          openConnectModal?.()
        } else {
          swap()
        }
      }}
      disabled={
        isDisconnected || isConnecting
          ? false
          : !address ||
            !tokenIn ||
            !tokenOut ||
            isFetchingQuote ||
            errorFetchingQuote ||
            Number(amountIn) === 0 ||
            !(
              Number(
                formatUnits(
                  tokenInBalance?.value || 0n,
                  tokenInBalance?.decimals || 18
                )
              ) >= Number(amountIn)
            )
      }
    >
      {isDisconnected || isConnecting ? 'Connect Wallet' : 'Swap'}
    </Button>
  )

  if (!isMounted) {
    return null
  }

  return (
    <Modal
      trigger={trigger}
      open={open}
      onOpenChange={(open) => {
        if (!isDisconnected) {
          setOpen(open)
        }
      }}
      contentCss={{ width: '100%' }}
    >
      {swapStep === SwapStep.Error ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          <ErrorWell css={{ width: '100%' }} />
          <Text style="h5">Sign your intent</Text>
          <IntentInfo
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            amountIn={amountIn}
            amountOut={amountOut}
          />
          {txHash ? (
            <Anchor
              href={`${activeChain?.blockExplorers?.default?.url}/tx/${txHash}`}
              target="_blank"
            >
              View on {activeChain?.blockExplorers?.default?.name}:{' '}
              {truncateAddress(txHash)}
            </Anchor>
          ) : null}
          <Button
            css={{ justifyContent: 'center', width: '100%' }}
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </Flex>
      ) : null}
      {swapStep === SwapStep.Signing ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          <Text style="h5">Sign your intent</Text>
          <IntentInfo
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            amountIn={amountIn}
            amountOut={amountOut}
          />
          <Button
            disabled={true}
            css={{ justifyContent: 'center', width: '100%' }}
          >
            <LoadingSpinner />
            Sign Intent
          </Button>
        </Flex>
      ) : null}
      {swapStep === SwapStep.MetamaskApproving ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          <Text style="h5">
            Approve {tokenIn?.symbol} to be used for swapping.
          </Text>
          <Text style="body1" css={{ textAlign: 'center' }}>
            For ERC-20 swaps using Metamask, an additional transaction is needed
            for custom approval handling. To avoid this, you can use a different
            wallet.
          </Text>
          {txHash ? (
            <Anchor
              href={`${activeChain?.blockExplorers?.default?.url}/tx/${txHash}`}
              target="_blank"
            >
              View on {activeChain?.blockExplorers?.default?.name}:{' '}
              {truncateAddress(txHash)}
            </Anchor>
          ) : null}
          <Button
            disabled={true}
            css={{ justifyContent: 'center', width: '100%' }}
          >
            <LoadingSpinner />
            Approve Transaction
          </Button>
        </Flex>
      ) : null}
      {swapStep === SwapStep.Submitting ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          <Text style="h5">Submit your intent</Text>
          <IntentInfo
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            amountIn={amountIn}
            amountOut={amountOut}
          />
          {txHash ? (
            <Anchor
              href={`${activeChain?.blockExplorers?.default?.url}/tx/${txHash}`}
              target="_blank"
            >
              View on {activeChain?.blockExplorers?.default?.name}:{' '}
              {truncateAddress(txHash)}
            </Anchor>
          ) : null}
          <Button
            disabled={true}
            css={{ justifyContent: 'center', width: '100%' }}
          >
            <LoadingSpinner />
            Waiting for Approval
          </Button>
        </Flex>
      ) : null}
      {swapStep === SwapStep.Complete ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          <Box css={{ color: 'green10' }}>
            <FontAwesomeIcon icon={faCircleCheck} size="2x" />
          </Box>
          <Text style="h5">Success</Text>
          {txHash ? (
            <Anchor
              href={`${activeChain?.blockExplorers?.default?.url}/tx/${txHash}`}
              target="_blank"
            >
              View on {activeChain?.blockExplorers?.default?.name}:{' '}
              {truncateAddress(txHash)}
            </Anchor>
          ) : null}
          <Button
            css={{ justifyContent: 'center', width: '100%' }}
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </Flex>
      ) : null}
    </Modal>
  )
}
