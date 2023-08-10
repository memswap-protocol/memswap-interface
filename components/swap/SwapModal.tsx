import { FC, useState } from 'react'
import { Box, Button, Flex, Text } from '../primitives'
import { Token } from './SelectTokenModal'
import MEMSWAP_ABI from '../../constants/memswapABI'
import { mainnet, useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Modal } from '../common/Modal'
import { faPenNib, faWallet } from '@fortawesome/free-solid-svg-icons'
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
} from 'viem'
import { signTypedData, sendTransaction } from '@wagmi/core'
import { CHAIN_ID } from '../../pages/_app'

type FetchBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

enum SwapStep {
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
  const { address, isDisconnected } = useAccount()
  const { openConnectModal } = useConnectModal()

  const [open, setOpen] = useState(false)
  const [swapStep, setSwapStep] = useState<SwapStep>(SwapStep.Signature)

  const viemChain =
    Object.values(allChains).find((chain) => chain.id === CHAIN_ID) || mainnet

  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(),
  })

  console.log('--------------------')
  console.log(
    !address,
    !tokenIn,
    !tokenOut,
    isFetchingQuote,
    errorFetchingQuote,
    !(tokenInBalance && tokenInBalance?.value > 0n)
  )
  console.log(
    !address ||
      !tokenIn ||
      !tokenOut ||
      !isFetchingQuote ||
      !errorFetchingQuote ||
      !(tokenInBalance && tokenInBalance?.value > 0n)
  )
  console.log('--------------------')

  // Execute Swap
  const swap = async () => {
    try {
      // Create Intent
      const intent: any = {
        maker: address,
        filler: zeroAddress, // @TODO: is filler always zero address?
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
          chainId: CHAIN_ID,
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

      console.log('Intent: ', intent)

      // Approval Step
      setSwapStep(SwapStep.Approving)

      // Generate approval transaction
      const data = parseAbiParameter([
        'function approve(address spender, uint256 amount)',
      ])

      const abiItem = parseAbiItem(
        'function approve(address spender, uint256 amount)'
      )

      const endcodedData =
        encodeFunctionData({
          abi: [abiItem],
          args: [MEMSWAP, parseUnits(amountIn, tokenIn?.decimals || 18)],
        }) +
        encodeAbiParameters(
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
        ).slice(2)

      console.log('encoded data: ', endcodedData)

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

      console.log(hash)
    } catch (e) {
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
            !(tokenInBalance && tokenInBalance?.value > 0n)
      }
    >
      {isDisconnected ? 'Connect Wallet' : 'Swap'}
    </Button>
  )

  return (
    <Modal trigger={trigger} open={open}>
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
            <FontAwesomeIcon icon={faPenNib} />
          </Box>
          <Text style="h5">Sign Intent</Text>
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
