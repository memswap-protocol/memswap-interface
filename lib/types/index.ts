import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'
import { MEMSWAP_ERC20_ABI } from '../constants/abis'
import { Address } from 'viem'
import { paths } from '@reservoir0x/reservoir-sdk'
import { Token as UniswapToken } from '@uniswap/sdk-core'

// type IntentERC20 = AbiParametersToPrimitiveTypes<
//   ExtractAbiFunction<typeof MEMSWAP_ERC20_ABI, 'post'>['inputs']
// >['0'][0]

export enum Protocol {
  ERC20,
  ERC721,
  V2,
  V3,
}

type IntentERC20 = {
  isBuy: boolean
  buyToken: Address
  sellToken: Address
  maker: Address
  solver: Address
  source: Address
  feeBps: number
  surplusBps: number
  startTime: number
  endTime: number
  nonce: string
  isPartiallyFillable: boolean
  isSmartOrder: boolean
  isIncentivized: boolean
  amount: string
  endAmount: string
  startAmountBps: number
  expectedAmountBps: number
  signature: Address
}

type IntentERC721 = IntentERC20 & {
  isCriteriaOrder: boolean
  tokenIdOrCriteria: string
}

type ApiCurrency = {
  id: string
  isNative: boolean
  isToken: boolean
  chainId: number
  decimals: number
  symbol: string
  name: string
  address: Address
  icon: string
}

type ApiIntent = {
  id: Address
  isBuy: boolean
  buyToken: ApiCurrency
  sellToken: ApiCurrency
  maker: Address
  solver: Address
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

type SwapMode = 'Best' | 'Trustless' | 'Private'

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
