import { Address } from 'viem'
import { Token } from '../components/swap/SelectTokenModal'

const MEMSWAP = '0x749f8feaec5eb53f9ce677a252467fa289272591'
const MEMSWAP_WETH = '0x5088a0a51e45b5a00c049676dc11f12bb8b4ec29'

const MATCHMAKER = '0xf4f6df97aa065758c70e6fb7d938ec392dda98e0'

const UNISWAP_QUOTER_CONTRACT = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'

const WRAPPED_CONTRACTS: Record<number, Address> = {
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
  UNISWAP_QUOTER_CONTRACT,
  WRAPPED_CONTRACTS,
  USDC_TOKENS,
}
