import { Address } from 'viem'
import { MEMSWAP } from '../constants/contracts'
import { Intent } from '../types'
import { _TypedDataEncoder } from '@ethersproject/hash'

// Need to use TypedDataEncoder from @ethersproject for now as viem's hashStruct function is not currently exported
// See here for more info: https://github.com/wagmi-dev/viem/discussions/761
const getIntentHash = (intent: Intent) =>
  _TypedDataEncoder.hashStruct('Intent', getEIP712Types(), intent)

const getEIP712Domain = (chainId: number) => ({
  name: 'Memswap',
  version: '1.0',
  chainId,
  verifyingContract: MEMSWAP[chainId],
})

const getEIP712Types = () => ({
  Intent: [
    {
      name: 'tokenIn',
      type: 'address',
    },
    {
      name: 'tokenOut',
      type: 'address',
    },
    {
      name: 'maker',
      type: 'address',
    },
    {
      name: 'matchmaker',
      type: 'address',
    },
    {
      name: 'source',
      type: 'address',
    },
    {
      name: 'feeBps',
      type: 'uint16',
    },
    {
      name: 'surplusBps',
      type: 'uint16',
    },
    {
      name: 'deadline',
      type: 'uint32',
    },
    {
      name: 'isPartiallyFillable',
      type: 'bool',
    },
    {
      name: 'amountIn',
      type: 'uint128',
    },
    {
      name: 'endAmountOut',
      type: 'uint128',
    },
    {
      name: 'startAmountBps',
      type: 'uint16',
    },
    {
      name: 'expectedAmountBps',
      type: 'uint16',
    },
  ],
})

export { getIntentHash, getEIP712Domain, getEIP712Types }
