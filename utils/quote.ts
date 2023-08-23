import { zeroAddress } from 'viem'
import { WRAPPED_CONTRACTS } from '../constants/contracts'
import { useNetwork } from 'wagmi'

// For ETH, need to use WETH address to fetch the quote
export const resolveTokenAddress = (
  address?: string,
  activeChain?: ReturnType<typeof useNetwork>['chain']
): string | undefined => {
  return address === zeroAddress
    ? WRAPPED_CONTRACTS[activeChain?.id || 1]
    : address
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
