import { Address } from 'viem'
import { Token } from '../types'

type ChainIdToAddress = { [chainId: number]: Address }

// Protocol
const MEMSWAP: ChainIdToAddress = {
  1: '0x63c9362a7bedc92dec83433c15d623fbd3e1e5a9',
  5: '0x62e309adcf935d62f824081148798ef8a7466b66',
}

const MEMSWAP_WETH: ChainIdToAddress = {
  1: '0x2712515766af2e2680f20e8372c7ea6010eaca66',
  5: '0x5088a0a51e45b5a00c049676dc11f12bb8b4ec29',
}

// Matchmaker
const MATCHMAKER: ChainIdToAddress = {
  1: '0xf4f6df97aa065758c70e6fb7d938ec392dda98e0',
  5: '0xf4f6df97aa065758c70e6fb7d938ec392dda98e0',
}

// Solver
const SOLVER: ChainIdToAddress = {
  1: '0x743dbd073d951bc1e7ee276eb79a285595993d63',
  5: '0x743dbd073d951bc1e7ee276eb79a285595993d63',
}
const SOLUTION_PROXY: ChainIdToAddress = {
  1: '0x885857a1e82d5285f03b4bc562dbeace8921fac2',
  5: '0xbdaac8d9627e17ad3a7ae34f98a604916f899628',
}

const WRAPPED_CONTRACTS: ChainIdToAddress = {
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', //mainnet
  5: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', //goerli
}

const USDC_TOKENS: Record<number, Token> = {
  1: {
    chainId: 1,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USDCoin',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  5: {
    chainId: 5,
    address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    symbol: 'USDC',
    name: 'USDCoin',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
}

export {
  MEMSWAP,
  MEMSWAP_WETH,
  MATCHMAKER,
  SOLVER,
  SOLUTION_PROXY,
  WRAPPED_CONTRACTS,
  USDC_TOKENS,
}
