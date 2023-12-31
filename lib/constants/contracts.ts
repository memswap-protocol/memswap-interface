import { Address } from 'viem'
import { Token } from '../types'

export type ChainIdToAddress = { [chainId: number]: Address }

// Protocol
const MEMSWAP_ERC20: ChainIdToAddress = {
  1: '0x2b8763751a3141dee02ac83290a3426161fe591a',
  5: '0xbc1287f5af439c7d6dcfa0bdcbb30d81725ffda0',
}

const MEMSWAP_ERC721: ChainIdToAddress = {
  1: '0x4df1c16c6761e999ff587568be1468d4cfb17c37',
  5: '0x3a62977f4d0a26ce6feb66e180e3eabd631dbf32',
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

// Ponder Api
const MEMSWAP_API: { [chainId: number]: string } = {
  1: 'https://memswap-backend-mainnet.up.railway.app',
  5: 'https://memswap-backend-goerli.up.railway.app',
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
  MEMSWAP_API,
  USDC_TOKENS,
}
