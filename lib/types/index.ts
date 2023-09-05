import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'
import { MEMSWAP_ABI } from '../constants/abis'
import { Address } from 'viem'

type Intent = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<typeof MEMSWAP_ABI, 'validate'>['inputs']
>['0'][0]

type ApiIntent = {
  id: Address
  tokenIn: Address
  tokenOut: Address
  maker: Address
  matchmaker: Address
  deadline: number
  isPartiallyFillable: boolean
  amountIn: bigint
  endAmountOut: bigint
  events: string[]
  isCancelled: boolean
  isValidated: boolean
  amountFilled: bigint
}

type Token = {
  chainId: number
  address: Address
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

type SwapMode = 'Rapid' | 'Dutch' | 'Private'

type FetchBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

export {
  type Intent,
  type ApiIntent,
  type Token,
  type SwapMode,
  type FetchBalanceResult,
}
