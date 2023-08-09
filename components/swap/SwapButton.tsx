import { FC } from 'react'
import { Button } from '../primitives'
import { Token } from './SelectTokenModal'
import MEMSWAP_ABI from '../../constants/memswapABI'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'

type FetchBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

type Props = {
  address?: `0x${string}`
  tokenIn?: Token
  tokenOut?: Token
  tokenInBalance?: FetchBalanceResult
  amountIn: string
  amountOut: string
  isFetchingQuote: boolean
  errorFetchingQuote: boolean
}

const MEMSWAP = '0x69f2888491ea07bb10936aa110a5e0481122efd3'

export const SwapButton: FC<Props> = ({
  address,
  tokenIn,
  tokenOut,
  tokenInBalance,
}) => {
  const { isDisconnected } = useAccount()

  const { openConnectModal } = useConnectModal()

  if (isDisconnected) {
    return (
      <Button
        color="primary"
        css={{ justifyContent: 'center' }}
        onClick={openConnectModal}
      >
        Connect Wallet
      </Button>
    )
  }

  return (
    <Button
      color="primary"
      css={{ justifyContent: 'center' }}
      disabled={
        !address ||
        !tokenIn ||
        !tokenOut ||
        !(tokenInBalance && tokenInBalance?.value > 0n)
      }
      onClick={() => {}}
    >
      Swap
    </Button>
  )
}
