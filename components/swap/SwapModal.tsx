import { FC, useEffect, useState } from 'react'
import { Anchor, Box, Button, ErrorWell, Flex, Text } from '../primitives'
import {
  erc20ABI,
  useAccount,
  useContractEvent,
  useNetwork,
  usePublicClient,
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Modal } from '../common/Modal'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { truncateAddress } from '../../utils/truncate'
import {
  getEIP712Domain,
  getEIP712Types,
  getIntentHash,
} from '../../utils/swap'
import { _TypedDataEncoder } from '@ethersproject/hash'
import {
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
  writeContract,
} from '@wagmi/core'
import { useToast } from '../../hooks/useToast'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { IntentInfo } from './IntentInfo'
import { useMounted, useWethEthSwap } from '../../hooks'
import { MEMSWAP_ABI } from '../../constants/abis'
import {
  MATCHMAKER,
  MEMSWAP,
  MEMSWAP_WETH,
  WRAPPED_CONTRACTS,
} from '../../constants/contracts'
import { FetchBalanceResult, Intent, Token } from '../../types'

enum SwapStep {
  Sign,
  MetamaskApproval,
  Submit,
}

type SwapModalProps = {
  tokenIn?: Token
  tokenOut?: Token
  tokenInBalance?: FetchBalanceResult
  referrer?: Address
  amountIn: string
  amountOut: string
  slippagePercentage: string
  deadline: string
  isFetchingQuote: boolean
  errorFetchingQuote: boolean
}

export const SwapModal: FC<SwapModalProps> = ({
  tokenIn,
  tokenOut,
  tokenInBalance,
  referrer,
  amountIn,
  amountOut,
  slippagePercentage,
  deadline,
  isFetchingQuote,
  errorFetchingQuote,
}) => {
  // Configuration
  const isMounted = useMounted()
  const { chain: activeChain } = useNetwork()
  const { address, isDisconnected, isConnecting, connector } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { toast } = useToast()
  const publicClient = usePublicClient()

  // States
  const [open, setOpen] = useState(false)
  const [swapStep, setSwapStep] = useState<SwapStep>(SwapStep.Sign)
  const [error, setError] = useState<Error | undefined>()
  const [txHash, setTxHash] = useState<Address | undefined>()
  const [txSuccess, setTxSuccess] = useState(false)
  const [metamaskApprovalHash, setMetamaskApprovalHash] = useState<
    Address | undefined
  >()
  const [waitingForFulfillment, setWaitingForFulfillment] = useState(false)
  const [fulfilledHash, setFulfilledHash] = useState<Address | undefined>()
  const [fulfilledSuccess, setFulfilledSuccess] = useState(false)
  const [intentHash, setIntentHash] = useState<string | undefined>()

  // Conditional Variables
  const memswapContract = MEMSWAP[activeChain?.id || 1]
  const memswapWethContract = MEMSWAP_WETH[activeChain?.id || 1]
  const isMetamaskWallet = connector?.id === 'metaMask'
  const isEthToWethSwap =
    tokenIn?.address === zeroAddress &&
    tokenOut?.address === WRAPPED_CONTRACTS[activeChain?.id || 1]
  const isWethToEthSwap =
    tokenIn?.address === WRAPPED_CONTRACTS[activeChain?.id || 1] &&
    tokenOut?.address === zeroAddress

  // Reset state on modal close
  useEffect(() => {
    if (!open) {
      setSwapStep(SwapStep.Sign)
      setError(undefined)
      setTxHash(undefined)
      setTxSuccess(false)
      setMetamaskApprovalHash(undefined)
      setFulfilledHash(undefined)
      setFulfilledSuccess(false)
    }
  }, [open])

  // Execute Swap
  const swap = async () => {
    if (!address) {
      throw Error('No wallet connected')
    }
    if (!tokenIn?.address || !tokenOut?.address) {
      throw Error('Missing tokenIn or tokenOut address')
    }
    try {
      const parsedAmountIn = parseUnits(amountIn, tokenIn?.decimals || 18)
      const parsedAmountOut = parseUnits(amountOut, tokenOut?.decimals || 18)

      const endAmountOut =
        Number(amountOut) * (1 - Number(slippagePercentage) / 100)
      const parsedEndAmountOut = parseUnits(
        endAmountOut.toString(),
        tokenOut?.decimals || 18
      )

      const processedTokenInAddress =
        tokenIn?.address === zeroAddress
          ? memswapWethContract
          : tokenIn?.address

      // Create Intent
      const intent = {
        tokenIn: processedTokenInAddress,
        tokenOut: tokenOut.address,
        maker: address,
        matchmaker: MATCHMAKER[activeChain?.id || 1] as Address,
        source: referrer ?? address,
        feeBps: 0,
        surplusBps: 0,
        deadline: await publicClient
          .getBlock()
          .then((b) => Number(b!.timestamp) + Number(deadline) * 60),
        isPartiallyFillable: false,
        amountIn: parsedAmountIn,
        endAmountOut: parsedEndAmountOut,
        startAmountBps: 0,
        expectedAmountBps: 0,
      } as Intent

      intent.signature = await signTypedData({
        domain: getEIP712Domain(activeChain?.id || 1),
        types: getEIP712Types(),
        message: intent,
        primaryType: 'Intent',
      })

      // Encode approval and intent
      const approveMethod =
        processedTokenInAddress === memswapWethContract
          ? 'depositAndApprove'
          : 'approve'

      const approveAbiItem = parseAbiItem(
        `function ${approveMethod}(address spender, uint256 amount)`
      )

      const encodedApprovalData = encodeFunctionData({
        abi: [approveAbiItem],
        args: [memswapContract, parsedAmountIn],
      })

      const encodedIntentData = encodeAbiParameters(
        parseAbiParameters([
          'address',
          'address',
          'address',
          'address',
          'address',
          'uint16',
          'uint16',
          'uint32',
          'bool',
          'uint128',
          'uint128',
          'uint16',
          'uint16',
          'bytes',
        ]),
        // @ts-ignore
        [
          intent.tokenIn,
          intent.tokenOut,
          intent.maker,
          intent.matchmaker,
          intent.source,
          intent.feeBps,
          intent.surplusBps,
          intent.deadline,
          intent.isPartiallyFillable,
          intent.amountIn,
          intent.endAmountOut,
          intent.startAmountBps,
          intent.expectedAmountBps,
          intent.signature,
        ]
      )

      const combinedEndcodedData =
        encodedApprovalData + encodedIntentData.slice(2)

      // Fetch allowance amount
      const allowanceAmount = await readContract({
        address: processedTokenInAddress,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, memswapContract],
      })

      // Generate intent hash and start listing for IntentSolved Event in useContractEvent hook
      // The intent could be solved in the same block that it is submitted, so we need to start listening before
      // we submit the transaction
      const intentHash = getIntentHash(intent)

      setIntentHash(intentHash)
      setWaitingForFulfillment(true)

      /////////////////////////////////////////////////////////////////////
      // Handle transactions
      /////////////////////////////////////////////////////////////////////

      // Scenario 1: User already has given approval greater than amountIn
      // Call 'post' method on Memswap contract
      if (allowanceAmount >= parsedAmountIn) {
        setSwapStep(SwapStep.Submit)

        const { hash } = await writeContract({
          address: memswapContract,
          abi: MEMSWAP_ABI,
          functionName: 'post',
          args: [intent],
          account: address,
          chainId: activeChain?.id,
        })

        setTxHash(hash)

        await publicClient.waitForTransactionReceipt({
          hash: hash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
        })
      }

      // Scenario 2: User is using metamask wallet
      // For metamask, an extra tx is required because the extension strips away any appended calldata
      // https://github.com/MetaMask/metamask-extension/issues/20439
      // 2 Separate transactions, 1 for approval, 1 to call 'post' method on Memswap contract
      else if (isMetamaskWallet) {
        setSwapStep(SwapStep.MetamaskApproval)

        const { hash: approvalHash } = await sendTransaction({
          chainId: activeChain?.id,
          to: processedTokenInAddress,
          account: address,
          value: 0n,
          data: encodedApprovalData,
        })

        setMetamaskApprovalHash(approvalHash)

        await publicClient.waitForTransactionReceipt({
          hash: approvalHash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
        })

        setSwapStep(SwapStep.Submit)

        const { hash: intentTransactionHash } = await writeContract({
          chainId: activeChain?.id,
          address: memswapContract,
          abi: MEMSWAP_ABI,
          functionName: 'post',
          args: [intent],
          account: address,
        })

        setTxHash(intentTransactionHash)

        await publicClient.waitForTransactionReceipt({
          hash: intentTransactionHash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
        })
      }

      // Scenario 3: Normal swap (user is has not given approval, is not using metamask wallet,
      // is not wrapping/unwrapping ETH)
      // 1 transaction with the intent appended to the approval
      else {
        setSwapStep(SwapStep.Submit)

        const { hash } = await sendTransaction({
          chainId: activeChain?.id,
          to: processedTokenInAddress,
          account: address,
          value: approveMethod === 'depositAndApprove' ? parsedAmountIn : 0n,
          data: combinedEndcodedData as Address,
        })

        setTxHash(hash)

        await publicClient.waitForTransactionReceipt({
          hash: hash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
        })
      }

      setTxSuccess(true)
    } catch (err: any) {
      console.error(err)
      const error = err as Error
      if (err?.code === 4001 || error?.name === 'UserRejectedRequestError') {
        error.message = 'User rejected the transaction.'
      } else if (error?.name === 'TransactionExecutionError') {
        error.message = 'Transaction failed.'
      } else {
        error.message = 'Oops, something went wrong.'
      }
      toast({
        title: error.message,
      })
      setError(error)
    }
  }

  // WETH<>ETH Swap
  const { handleWethEthSwap } = useWethEthSwap({
    tokenIn,
    amountIn,
    mode: isEthToWethSwap ? 'wrap' : 'unwrap',
    enabled: isEthToWethSwap || isWethToEthSwap,
  })

  // Listen for IntentSolved Event for submitted intent hash
  const unwatch = useContractEvent({
    chainId: activeChain?.id,
    address: waitingForFulfillment ? memswapContract : undefined,
    abi: MEMSWAP_ABI,
    eventName: 'IntentSolved',
    listener(log) {
      const eventIntentHash = log[0]?.args.intentHash
      if (eventIntentHash === intentHash) {
        unwatch?.()
        toast({
          title: 'Swap was successful.',
        })
        const eventFulfilledHash = log[0]?.transactionHash
        setFulfilledHash(eventFulfilledHash)
        setFulfilledSuccess(true)
        setWaitingForFulfillment(false)
      }
    },
  })

  function getButtonText() {
    if (isDisconnected || isConnecting) {
      return 'Connect Wallet'
    }
    if (!tokenOut || !tokenIn) {
      return 'Select a token'
    }
    if (
      Number(amountIn) >
      Number(
        formatUnits(tokenInBalance?.value || 0n, tokenInBalance?.decimals || 18)
      )
    ) {
      return 'Insufficient Balance'
    }
    if (!amountIn) {
      return `Enter ${tokenIn?.symbol} amount`
    }
    if (tokenIn?.symbol === 'ETH' && tokenOut?.symbol === 'WETH') {
      return 'Wrap'
    }
    if (tokenIn?.symbol === 'WETH' && tokenOut?.symbol === 'ETH') {
      return 'Unwrap'
    }
    return 'Swap'
  }

  const trigger = (
    <Button
      color="primary"
      css={{ justifyContent: 'center' }}
      onClick={() => {
        if (isDisconnected) {
          openConnectModal?.()
        } else if (isEthToWethSwap || isWethToEthSwap) {
          handleWethEthSwap?.()
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
      {getButtonText()}
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
        if (!isDisconnected && !(isEthToWethSwap || isWethToEthSwap)) {
          setOpen(open)
        }
      }}
      contentCss={{ width: '100%' }}
    >
      {swapStep === SwapStep.Sign ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          {error ? (
            <ErrorWell css={{ width: '100%' }} message={error?.message} />
          ) : null}
          <Text style="h5">Sign your order</Text>
          <IntentInfo
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            amountIn={amountIn}
            amountOut={amountOut}
          />
          {error ? (
            <Button
              onClick={() => {
                setError(undefined)
                swap()
              }}
              css={{ justifyContent: 'center', width: '100%' }}
            >
              Retry
            </Button>
          ) : (
            <Button
              disabled={true}
              css={{ justifyContent: 'center', width: '100%' }}
            >
              <LoadingSpinner />
              Sign Order
            </Button>
          )}
        </Flex>
      ) : null}
      {swapStep === SwapStep.MetamaskApproval ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          {error ? (
            <ErrorWell css={{ width: '100%' }} message={error?.message} />
          ) : null}
          <Text style="h5">
            Approve {tokenIn?.symbol} to be used for swapping.
          </Text>
          <Text style="body1" css={{ textAlign: 'center' }}>
            For ERC-20 swaps using Metamask, an additional transaction is needed
            for custom approval handling. To avoid this, you can use a different
            wallet.
          </Text>
          {metamaskApprovalHash ? (
            <Anchor
              href={`${activeChain?.blockExplorers?.default?.url}/tx/${metamaskApprovalHash}`}
              target="_blank"
            >
              View on {activeChain?.blockExplorers?.default?.name}:{' '}
              {truncateAddress(metamaskApprovalHash)}
            </Anchor>
          ) : null}
          <Button
            disabled={!error}
            css={{ justifyContent: 'center', width: '100%' }}
            onClick={() => setOpen(false)}
          >
            {error ? (
              'Close'
            ) : (
              <>
                <LoadingSpinner />
                Approve Transaction
              </>
            )}
          </Button>
        </Flex>
      ) : null}
      {swapStep === SwapStep.Submit ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          {error ? (
            <ErrorWell css={{ width: '100%' }} message={error?.message} />
          ) : null}
          <Text style="h5">Confirm Swap</Text>

          <IntentInfo
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            amountIn={amountIn}
            amountOut={amountOut}
          />
          <Flex direction="column" css={{ gap: '3', width: '100%' }}>
            <Flex
              direction="column"
              css={{
                backgroundColor: 'gray2',
                p: '4',
                borderRadius: 8,
                gap: '2',
              }}
            >
              <Flex justify="between" align="center">
                <Text style="subtitle1">Submit yor order</Text>

                {txSuccess ? (
                  <Box css={{ color: 'green10' }}>
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      style={{ width: 20, height: 20 }}
                    />
                  </Box>
                ) : (
                  <LoadingSpinner />
                )}
              </Flex>
              {txHash ? (
                <Anchor
                  href={`${activeChain?.blockExplorers?.default?.url}/tx/${txHash}`}
                  target="_blank"
                >
                  View on {activeChain?.blockExplorers?.default?.name}:{' '}
                  {truncateAddress(txHash)}
                </Anchor>
              ) : null}
            </Flex>
            <Flex
              direction="column"
              css={{
                backgroundColor: 'gray2',
                p: '4',
                borderRadius: 8,
                gap: '2',
              }}
            >
              <Flex justify="between" align="center">
                <Text style="subtitle1">Wait for the swap to be fulfilled</Text>

                {fulfilledSuccess ? (
                  <Box css={{ color: 'green10' }}>
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      style={{ width: 20, height: 20 }}
                    />
                  </Box>
                ) : (
                  <LoadingSpinner />
                )}
              </Flex>
              {fulfilledHash ? (
                <Anchor
                  href={`${activeChain?.blockExplorers?.default?.url}/tx/${fulfilledHash}`}
                  target="_blank"
                >
                  View on {activeChain?.blockExplorers?.default?.name}:{' '}
                  {truncateAddress(fulfilledHash)}
                </Anchor>
              ) : txSuccess && !fulfilledSuccess ? (
                <Text color="subtle" style="body2">
                  You can close this modal while waiting for the swap to be
                  fulfilled. The transaction will continue in the background.
                </Text>
              ) : null}
            </Flex>
          </Flex>
        </Flex>
      ) : null}
    </Modal>
  )
}
