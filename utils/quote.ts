import { zeroAddress } from 'viem'
import { WRAPPED_CONTRACTS } from '../constants/contracts'
import { useNetwork } from 'wagmi'
import { Token } from '../types'
import { Ether, Token as UniswapToken } from '@uniswap/sdk-core'

export const createUniswapToken = (token: Token, chainId: number) => {
  if (token?.address === zeroAddress) {
    return Ether.onChain(chainId)
  } else {
    return new UniswapToken(
      token.chainId,
      token.address,
      token.decimals,
      token.symbol,
      token.name
    )
  }
}

export const useIsEthToWethSwap = (
  addressIn?: string,
  addressOut?: string,
  activeChain?: ReturnType<typeof useNetwork>['chain']
): boolean => {
  return (
    (addressIn === zeroAddress ||
      addressIn === WRAPPED_CONTRACTS[activeChain?.id || 1]) &&
    (addressOut === zeroAddress ||
      addressOut === WRAPPED_CONTRACTS[activeChain?.id || 1])
  )
}
