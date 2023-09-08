import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'
import { MEMSWAP_ABI } from '../constants/abis'
import { Address } from 'viem'
import { paths } from '@reservoir0x/reservoir-sdk'

// type Intent = AbiParametersToPrimitiveTypes<
//   ExtractAbiFunction<typeof MEMSWAP_ABI, 'post'>['inputs']
// >['0'][0]

type Intent = {
  side: Side
  tokenIn: string
  tokenOut: string
  maker: string
  matchmaker: string
  source: string
  feeBps: number
  surplusBps: number
  startTime: number
  endTime: number
  nonce: string
  isPartiallyFillable: boolean
  amount: string
  endAmount: string
  startAmountBps: number
  expectedAmountBps: number
  hasDynamicSignature: string //was string
  signature: string
}

export enum Side {
  BUY,
  SELL,
}

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

type Collection = NonNullable<
  paths['/collections/v6']['get']['responses']['200']['schema']['collections']
>[0]

type SwapMode = 'Rapid' | 'Dutch' | 'Private'

type FetchBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

export {
  type Intent,
  type Token,
  type Collection,
  type ApiIntent,
  type SwapMode,
  type FetchBalanceResult,
}
