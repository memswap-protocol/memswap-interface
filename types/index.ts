import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'
import { MEMSWAP_ABI } from '../constants/abis'

type Intent = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<typeof MEMSWAP_ABI, 'validate'>['inputs']
>['0'][0]

type Token = {
  chainId: number
  address: string
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
