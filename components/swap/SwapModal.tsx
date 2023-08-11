import { FC, useEffect, useState } from 'react'
import { Box, Button, Flex, Text } from '../primitives'
import { Token } from './SelectTokenModal'
import MEMSWAP_ABI from '../../constants/memswapABI'
import { mainnet, useAccount, useNetwork } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Modal } from '../common/Modal'
import {
  faCircleCheck,
  faPenNib,
  faWallet,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as allChains from 'viem/chains'
import {
  createPublicClient,
  http,
  parseUnits,
  zeroAddress,
  parseAbi,
  parseAbiParameter,
  encodeFunctionData,
  parseAbiItem,
  encodeAbiParameters,
  parseAbiParameters,
  Address,
  formatUnits,
} from 'viem'
import { signTypedData, sendTransaction } from '@wagmi/core'

type FetchBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

enum SwapStep {
  Error,
  Signature,
  Approving,
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

const MEMSWAP = '0x69f2888491ea07bb10936aa110a5e0481122efd3'

export const SwapModal: FC<Props> = ({
  tokenIn,
  tokenOut,
  tokenInBalance,
  amountIn,
  amountOut,
  isFetchingQuote,
  errorFetchingQuote,
}) => {
  const { chain: activeChain } = useNetwork()
  const { address, isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()

  const [open, setOpen] = useState(false)
  const [swapStep, setSwapStep] = useState<SwapStep>(SwapStep.Signature)
  const [error, setError] = useState<Error | undefined>()

  const viemChain =
    Object.values(allChains).find(
      (chain) => chain.id === (activeChain?.id || 1)
    ) || mainnet

  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(),
  })

  // Reset state on close
  useEffect(() => {
    if (!open) {
      setSwapStep(SwapStep.Signature)
      setError(undefined)
    }
  }, [open])

  // Execute Swap
  const swap = async () => {
    try {
      // Create Intent
      const intent: any = {
        maker: address,
        filler: zeroAddress,
        tokenIn: tokenIn?.address,
        tokenOut: tokenOut?.address,
        referrer: zeroAddress,
        referrerFeeBps: 0,
        referrerSurplusBps: 0,
        deadline: await publicClient
          .getBlock()
          .then((b) => Number(b!.timestamp) + 3600 * 24),
        amountIn: parseUnits(amountIn, tokenIn?.decimals || 18),
        startAmountOut: parseUnits(amountOut, tokenOut?.decimals || 18),
        expectedAmountOut: parseUnits(amountOut, tokenOut?.decimals || 18),
        endAmountOut: parseUnits(amountOut, tokenOut?.decimals || 18),
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

      // Approval Step
      setSwapStep(SwapStep.Approving)

      // Generate approval transaction
      const abiItem = parseAbiItem(
        'function approve(address spender, uint256 amount)'
      )

      const encodedFunctionData = encodeFunctionData({
        abi: [abiItem],
        args: [MEMSWAP, parseUnits(amountIn, tokenIn?.decimals || 18)],
      })

      const encodedAbiParameters = encodeAbiParameters(
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

      const endcodedData = encodedFunctionData + encodedAbiParameters.slice(2)

      const currentBaseFee = await publicClient
        .getBlock()
        .then((b) => b!.baseFeePerGas)

      const maxPriorityFeePerGas = parseUnits('1', 18)

      const { hash } = await sendTransaction({
        to: tokenIn?.address as Address,
        data: endcodedData as Address,
        maxFeePerGas: (currentBaseFee || 0n) + maxPriorityFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
      })

      setSwapStep(SwapStep.Complete)
    } catch (e: any) {
      const error = e as Error
      setSwapStep(SwapStep.Error)
      setError(error)
      console.log(e)
    }
  }

  const trigger = (
    <Button
      color="primary"
      css={{ justifyContent: 'center' }}
      onClick={() => {
        isDisconnected ? openConnectModal?.() : swap()
      }}
      disabled={
        isDisconnected
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
      {isDisconnected ? 'Connect Wallet' : 'Swap'}
    </Button>
  )

  return (
    <Modal trigger={trigger} open={open} onOpenChange={setOpen}>
      {swapStep === SwapStep.Error ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          <Box css={{ color: 'gray9' }}>
            <FontAwesomeIcon icon={faPenNib} />
          </Box>
          <Text style="h5">Oops, something went wrong.</Text>
          <Text style="subtitle2" color="error">
            {error?.message}
          </Text>
          <Button css={{ justifyContent: 'center', width: '100%' }}>
            Close
          </Button>
        </Flex>
      ) : null}
      {swapStep === SwapStep.Signature ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          <Box css={{ color: 'gray9' }}>
            <FontAwesomeIcon icon={faPenNib} />
          </Box>
          <Text style="h5">Sign Intent in your wallet</Text>
          <Button
            disabled={true}
            css={{ justifyContent: 'center', width: '100%' }}
          >
            Sign Intent
          </Button>
        </Flex>
      ) : null}
      {swapStep === SwapStep.Approving ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          <Box css={{ color: 'gray9' }}>
            <FontAwesomeIcon icon={faWallet} />
          </Box>
          <Text style="h5">Confirm Swaps</Text>
          <Button
            disabled={true}
            css={{ justifyContent: 'center', width: '100%' }}
          >
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
          <Box css={{ color: 'gray9' }}>
            <FontAwesomeIcon icon={faCircleCheck} />
          </Box>
          <Text style="h5">Sucess</Text>
          <Button
            css={{ justifyContent: 'center', width: '100%' }}
            onClick={() => {
              setOpen(false)
            }}
          >
            Done
          </Button>
        </Flex>
      ) : null}
    </Modal>
  )
}
