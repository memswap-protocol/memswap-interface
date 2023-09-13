import { Address, encodeAbiParameters, parseAbiParameters } from 'viem'
import axios from 'axios'
import { _TypedDataEncoder } from '@ethersproject/hash'
import { IntentERC20, IntentERC721, Protocol } from '../types'
import {
  MATCHMAKER_API,
  MEMSWAP_ERC20,
  MEMSWAP_ERC721,
} from '../constants/contracts'
import { MEMSWAP_ERC20_ABI } from '../constants/abis'
import { defaultAbiCoder } from '@ethersproject/abi'

const isERC721Intent = (intent: IntentERC20 | IntentERC721) =>
  'isCriteriaOrder' in intent

// Need to use TypedDataEncoder from @ethersproject for now as viem's hashStruct function is not currently exported
// See here for more info: https://github.com/wagmi-dev/viem/discussions/761
const getIntentHash = (intent: IntentERC20 | IntentERC721) =>
  _TypedDataEncoder.hashStruct(
    'Intent',
    getEIP712Types(isERC721Intent(intent) ? Protocol.ERC721 : Protocol.ERC20),
    intent
  )

const now = () => Math.floor(Date.now() / 1000)

const getEIP712Domain = (chainId: number, protocol: Protocol) => ({
  name: protocol === Protocol.ERC20 ? 'MemswapERC20' : 'MemswapERC721',
  version: '1.0',
  chainId,
  verifyingContract:
    protocol === Protocol.ERC20
      ? MEMSWAP_ERC20[chainId]
      : MEMSWAP_ERC721[chainId],
})

const getEIP712Types = (protocol: Protocol) => ({
  Intent: [
    {
      name: 'isBuy',
      type: 'bool',
    },
    {
      name: 'buyToken',
      type: 'address',
    },
    {
      name: 'sellToken',
      type: 'address',
    },
    {
      name: 'maker',
      type: 'address',
    },
    {
      name: 'solver',
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
      name: 'isSmartOrder',
      type: 'bool',
    },
    ...(protocol === Protocol.ERC721
      ? [
          {
            name: 'isCriteriaOrder',
            type: 'bool',
          },
          {
            name: 'tokenIdOrCriteria',
            type: 'uint256',
          },
        ]
      : []),
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
  ],
})

const encodeIntentAbiParameters = (intent: IntentERC20 | IntentERC721) => {
  return encodeAbiParameters(
    parseAbiParameters([
      'bool',
      'address',
      'address',
      'address',
      'address',
      'address',
      'uint16',
      'uint16',
      'uint32',
      'uint32',
      'uint256',
      'bool',
      'bool',
      ...(isERC721Intent(intent) ? ['bool', 'uint256'] : []),
      'uint128',
      'uint128',
      'uint16',
      'uint16',
      'bytes',
    ]),
    // @ts-ignore
    [
      intent.isBuy,
      intent.buyToken,
      intent.sellToken,
      intent.maker,
      intent.solver,
      intent.source,
      intent.feeBps,
      intent.surplusBps,
      intent.startTime,
      intent.endTime,
      intent.nonce,
      intent.isPartiallyFillable,
      intent.isSmartOrder,
      ...('isCriteriaOrder' in intent
        ? [intent.isCriteriaOrder, intent.tokenIdOrCriteria]
        : []),
      intent.amount,
      intent.endAmount,
      intent.startAmountBps,
      intent.expectedAmountBps,
      intent.signature,
    ]
  )
}

async function postPublicIntentToMatchmaker(
  chainId: number,
  intent: IntentERC20 | IntentERC721,
  hash: Address
) {
  try {
    const matchmakerApi = MATCHMAKER_API[chainId]
    const protocol = isERC721Intent(intent) ? 'erc721' : 'erc20'
    await axios.post(`${matchmakerApi}/${protocol}/intents/public`, {
      intent,
      approvalTxOrTxHash: hash,
    })
  } catch (e) {
    console.error('Error submitting intent to public matchmaker api:', e)
  }
}

export {
  getIntentHash,
  now,
  getEIP712Domain,
  getEIP712Types,
  encodeIntentAbiParameters,
  postPublicIntentToMatchmaker,
}
