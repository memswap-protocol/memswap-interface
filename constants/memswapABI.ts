const MEMSWAP_ABI = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'IntentAlreadyFulfilled', type: 'error' },
  { inputs: [], name: 'IntentExpired', type: 'error' },
  { inputs: [], name: 'IntentNotFulfilled', type: 'error' },
  { inputs: [], name: 'InvalidSignature', type: 'error' },
  { inputs: [], name: 'Unauthorized', type: 'error' },
  { inputs: [], name: 'UnsuccessfullCall', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'intentHash',
        type: 'bytes32',
      },
      {
        components: [
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'filler', type: 'address' },
          { internalType: 'contract IERC20', name: 'tokenIn', type: 'address' },
          {
            internalType: 'contract IERC20',
            name: 'tokenOut',
            type: 'address',
          },
          { internalType: 'address', name: 'referrer', type: 'address' },
          { internalType: 'uint32', name: 'referrerFeeBps', type: 'uint32' },
          {
            internalType: 'uint32',
            name: 'referrerSurplusBps',
            type: 'uint32',
          },
          { internalType: 'uint32', name: 'deadline', type: 'uint32' },
          { internalType: 'uint128', name: 'amountIn', type: 'uint128' },
          { internalType: 'uint128', name: 'startAmountOut', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'expectedAmountOut',
            type: 'uint128',
          },
          { internalType: 'uint128', name: 'endAmountOut', type: 'uint128' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        indexed: false,
        internalType: 'struct Memswap.Intent',
        name: 'intent',
        type: 'tuple',
      },
    ],
    name: 'IntentFulfilled',
    type: 'event',
  },
  {
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ORDER_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'filler', type: 'address' },
      { internalType: 'bytes32', name: 'intentHash', type: 'bytes32' },
    ],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'filler', type: 'address' },
          { internalType: 'contract IERC20', name: 'tokenIn', type: 'address' },
          {
            internalType: 'contract IERC20',
            name: 'tokenOut',
            type: 'address',
          },
          { internalType: 'address', name: 'referrer', type: 'address' },
          { internalType: 'uint32', name: 'referrerFeeBps', type: 'uint32' },
          {
            internalType: 'uint32',
            name: 'referrerSurplusBps',
            type: 'uint32',
          },
          { internalType: 'uint32', name: 'deadline', type: 'uint32' },
          { internalType: 'uint128', name: 'amountIn', type: 'uint128' },
          { internalType: 'uint128', name: 'startAmountOut', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'expectedAmountOut',
            type: 'uint128',
          },
          { internalType: 'uint128', name: 'endAmountOut', type: 'uint128' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct Memswap.Intent',
        name: 'intent',
        type: 'tuple',
      },
      { internalType: 'address', name: 'fillContract', type: 'address' },
      { internalType: 'bytes', name: 'fillData', type: 'bytes' },
    ],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'maker', type: 'address' },
          { internalType: 'address', name: 'filler', type: 'address' },
          { internalType: 'contract IERC20', name: 'tokenIn', type: 'address' },
          {
            internalType: 'contract IERC20',
            name: 'tokenOut',
            type: 'address',
          },
          { internalType: 'address', name: 'referrer', type: 'address' },
          { internalType: 'uint32', name: 'referrerFeeBps', type: 'uint32' },
          {
            internalType: 'uint32',
            name: 'referrerSurplusBps',
            type: 'uint32',
          },
          { internalType: 'uint32', name: 'deadline', type: 'uint32' },
          { internalType: 'uint128', name: 'amountIn', type: 'uint128' },
          { internalType: 'uint128', name: 'startAmountOut', type: 'uint128' },
          {
            internalType: 'uint128',
            name: 'expectedAmountOut',
            type: 'uint128',
          },
          { internalType: 'uint128', name: 'endAmountOut', type: 'uint128' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct Memswap.Intent',
        name: 'intent',
        type: 'tuple',
      },
    ],
    name: 'getIntentHash',
    outputs: [{ internalType: 'bytes32', name: 'intentHash', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'isDelegated',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    name: 'isFulfilled',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  { stateMutability: 'payable', type: 'receive' },
]

export { MEMSWAP_ABI }
