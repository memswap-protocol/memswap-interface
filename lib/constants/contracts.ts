import { Address } from 'viem'
import { Token } from '../types'

export type ChainIdToAddress = { [chainId: number]: Address }

// Protocol
const MEMSWAP_ERC20: ChainIdToAddress = {
  1: '0x19a1b89a83b2729c5c3920e5719b01f80af49621',
  5: '0xa5005349b7dcd9536832d97235675ef5ae40f095',
}

const MEMSWAP_ERC721: ChainIdToAddress = {
  1: '0xdb4f0db998bc1d429499fb11638fd3705e8e60cc',
  5: '0xafa58bbc787dcda022b698df78d613ea760727e2',
}

const MEMSWAP_WETH: ChainIdToAddress = {
  1: '0x8adda31fe63696ac64ded7d0ea208102b1358c44',
  5: '0x6cb5504b957625d01a88db4b27eaafd5ae4422b6',
}

// Matchmaker
const MATCHMAKER: ChainIdToAddress = {
  1: '0xf4f6df97aa065758c70e6fb7d938ec392dda98e0',
  5: '0xf4f6df97aa065758c70e6fb7d938ec392dda98e0',
}

const WRAPPED_CONTRACTS: ChainIdToAddress = {
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', //mainnet
  5: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', //goerli
}

// Matchmaker Api
const MATCHMAKER_API: { [chainId: number]: string } = {
  1: 'https://matchmaker-ethereum.up.railway.app',
  5: 'https://matchmaker-goerli.up.railway.app',
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
  MEMSWAP_ERC20,
  MEMSWAP_ERC721,
  MEMSWAP_WETH,
  MATCHMAKER,
  WRAPPED_CONTRACTS,
  MATCHMAKER_API,
  USDC_TOKENS,
}
