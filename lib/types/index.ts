import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'
import { MEMSWAP_ABI } from '../constants/abis'
import { Address } from 'viem'

type Intent = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<typeof MEMSWAP_ABI, 'validate'>['inputs']
>['0'][0]

// type Intent = {
//   tokenIn: Address
//   tokenOut: Address
//   maker: Address
//   matchmaker: Address
//   source: Address
//   feeBps: number
//   surplusBps: number
//   deadline: number
//   isPartiallyFillable: boolean
//   amountIn: string
//   endAmountOut: string
//   startAmountBps: number
//   expectedAmountBps: number
//   signature: Address
// }

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

export { type Intent, type Token, type SwapMode, type FetchBalanceResult }
