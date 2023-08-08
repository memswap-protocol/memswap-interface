import { FC } from 'react'
import { Button } from '../primitives'
import { Token } from './SelectTokenModal'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import MEMSWAP_ABI from '../../constants/memswapABI'

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
}

const MEMSWAP = '0x69f2888491ea07bb10936aa110a5e0481122efd3'

export const SwapButton: FC<Props> = ({
  address,
  tokenIn,
  tokenOut,
  tokenInBalance,
}) => {
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
      SWAP
    </Button>
  )
}
