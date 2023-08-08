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
  tokenOutBalance?: FetchBalanceResult
}

const MEMSWAP = '0x69f2888491ea07bb10936aa110a5e0481122efd3'

export const SwapButton: FC<Props> = ({
  address,
  tokenIn,
  tokenOut,
  tokenInBalance,
  tokenOutBalance,
}) => {
  const { config, error } = usePrepareContractWrite({
    address: MEMSWAP,
    abi: MEMSWAP_ABI,
    functionName: 'execute',
    args: [], //@TODO: configure args
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 1),
  })

  const {
    data,
    write: executeSwap,
    reset,
    isLoading,
    isSuccess,
  } = useContractWrite({
    ...config,
    onError: (error) => {
      console.log(error)
    },
    onSuccess: () => {
      console.log('Successfully executed')
    },
  })

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
      onClick={executeSwap}
    >
      SWAP
    </Button>
  )
}
