import { useMemo } from 'react'
import { usePublicClient, type PublicClient } from 'wagmi'
import { providers } from 'ethers'
import { type HttpTransport } from 'viem'

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  // Alpha Router doesn't work with fallback providers, so extract first transport as a JsonRpcProvider
  if (transport.type === 'fallback') {
    return new providers.JsonRpcProvider(
      transport?.transports[0].value.url,
      network
    )
  }
  // return new providers.FallbackProvider(
  //   (transport?.transports as ReturnType<HttpTransport>[]).map(
  //     ({ value }) => {
  //       return new providers.JsonRpcProvider(value?.url, network)
  //     }
  //   )
  // )
  return new providers.JsonRpcProvider(transport.url, network)
}

/** Hook to convert a viem Public Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId })
  return useMemo(() => publicClientToProvider(publicClient), [publicClient])
}
