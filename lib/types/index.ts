import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'
import { MEMSWAP_ABI } from '../constants/abis'
import { Address } from 'viem'
import { paths } from '@reservoir0x/reservoir-sdk'
import { Token as UniswapToken } from '@uniswap/sdk-core'

// type IntentERC20 = AbiParametersToPrimitiveTypes<
//   ExtractAbiFunction<typeof MEMSWAP_ABI, 'post'>['inputs']
// >['0'][0]

export enum Protocol {
  ERC20,
  ERC721,
}

type IntentERC20 = {
  isBuy: boolean
  buyToken: Address
  sellToken: Address
  maker: Address
  matchmaker: Address
  source: Address
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
  hasDynamicSignature: boolean
  signature: Address
}

type IntentERC721 = IntentERC20 & {
  hasCriteria: boolean
  tokenIdOrCriteria: string
}

type ApiIntent = {
  id: Address
  isBuy: boolean
  buyToken: UniswapToken
  sellToken: UniswapToken
  maker: Address
  matchmaker: Address
  source: Address
  feeBps: number
  surplusBps: number
  startTime: number
  endTime: number
  isPartiallyFillable: boolean
  amount: bigint
  endAmount: bigint
  startAmountBps: number
  expectedAmountBps: number
  isCancelled: boolean
  isPreValidated: boolean
  events: string[]
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
  paths['/collections/v7']['get']['responses']['200']['schema']['collections']
>[0]

type SwapMode = 'Rapid' | 'Dutch' | 'Private'

type FetchBalanceResult = {
  decimals: number
  formatted: string
  symbol: string
  value: bigint
}

export {
  type IntentERC20,
  type IntentERC721,
  type Token,
  type Collection,
  type ApiIntent,
  type SwapMode,
  type FetchBalanceResult,
}
