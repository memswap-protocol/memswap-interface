import { mainnet, useNetwork } from 'wagmi'

const useSupportedNetwork = () => {
  const { chain, chains } = useNetwork()

  return {
    chain: chain && !chain?.unsupported ? chain : mainnet,
    chains: chains,
  }
}

export default useSupportedNetwork
