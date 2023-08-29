import { useMemo } from 'react'
import { usePublicClient, type PublicClient } from 'wagmi'
import { providers } from 'ethers'

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  // Uniswap's Alpha Router doesn't work with fallback providers, so just extract the first transport
  if (transport.type === 'fallback') {
    return new providers.JsonRpcProvider(
      transport?.transports[0].value.url,
      network
    )
  }

  return new providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId })
  return useMemo(() => publicClientToProvider(publicClient), [publicClient])
}
