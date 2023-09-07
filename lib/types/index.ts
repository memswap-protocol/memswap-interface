import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'
import { MEMSWAP_ABI } from '../constants/abis'
import { Address } from 'viem'

type Intent = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<typeof MEMSWAP_ABI, 'validate'>['inputs']
>['0'][0]

enum Side {
  BUY,
  SELL,
}

type Token = {
  chainId: number
  address: Address
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

type Collection = {
  id?: string
  name?: string
  image?: string
  tokenCount?: string
  floorAsk?: {
    id?: string | undefined
    sourceDomain?: string | undefined
    price?:
      | {
          currency?:
            | {
                contract?: string | undefined
                name?: string | undefined
                symbol?: string | undefined
                decimals?: number | undefined
              }
            | undefined
          amount?:
            | {
                raw?: string | undefined
                decimal?: number | undefined
                usd?: number | undefined
                native?: number | undefined
              }
            | undefined
          netAmount?:
            | {
                raw?: string | undefined
                decimal?: number | undefined
                usd?: number | undefined
                native?: number | undefined
              }
            | undefined
        }
      | undefined
  }
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
  type Side,
  type Token,
  type Collection,
  type SwapMode,
  type FetchBalanceResult,
}
