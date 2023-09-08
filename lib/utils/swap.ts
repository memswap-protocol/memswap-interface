import { Address } from 'viem'
import { MEMSWAP } from '../constants/contracts'
import { Intent } from '../types'
import { _TypedDataEncoder } from '@ethersproject/hash'
import axios from 'axios'

// Need to use TypedDataEncoder from @ethersproject for now as viem's hashStruct function is not currently exported
// See here for more info: https://github.com/wagmi-dev/viem/discussions/761
const getIntentHash = (intent: Intent) =>
  _TypedDataEncoder.hashStruct('Intent', getEIP712Types(), intent)

const now = () => Math.floor(Date.now() / 1000)

const getEIP712Domain = (chainId: number) => ({
  name: 'Memswap',
  version: '1.0',
  chainId,
  verifyingContract: MEMSWAP[chainId],
})

const getEIP712Types = () => ({
  Intent: [
    {
      name: 'side',
      type: 'uint8',
    },
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
      name: 'startTime',
      type: 'uint32',
    },
    {
      name: 'endTime',
      type: 'uint32',
    },
    {
      name: 'nonce',
      type: 'uint256',
    },
    {
      name: 'isPartiallyFillable',
      type: 'bool',
    },
    {
      name: 'amount',
      type: 'uint128',
    },
    {
      name: 'endAmount',
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
    {
      name: 'hasDynamicSignature',
      type: 'bool',
    },
  ],
})

async function postPublicIntentToMatchmaker(intent: Intent, hash: Address) {
  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_MATCHMAKER_BASE_URL}/intents/public`,
      {
        intent,
        approvalTxOrTxHash: hash,
      }
    )
  } catch (e) {
    console.error('Error submitting intent to public matchmaker api:', e)
  }
}

export {
  getIntentHash,
  now,
  getEIP712Domain,
  getEIP712Types,
  postPublicIntentToMatchmaker,
}
