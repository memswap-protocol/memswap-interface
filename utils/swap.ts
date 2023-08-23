import { Address } from 'viem'
import { MEMSWAP } from '../constants/contracts'

const getEIP712Domain = (chainId: number) => ({
  name: 'Memswap',
  version: '1.0',
  chainId,
  verifyingContract: MEMSWAP as Address,
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
      name: 'filler',
      type: 'address',
    },
    {
      name: 'referrer',
      type: 'address',
    },
    {
      name: 'referrerFeeBps',
      type: 'uint32',
    },
    {
      name: 'referrerSurplusBps',
      type: 'uint32',
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
      name: 'startAmountOut',
      type: 'uint128',
    },
    {
      name: 'expectedAmountOut',
      type: 'uint128',
    },
    {
      name: 'endAmountOut',
      type: 'uint128',
    },
  ],
})

export { getEIP712Domain, getEIP712Types }
