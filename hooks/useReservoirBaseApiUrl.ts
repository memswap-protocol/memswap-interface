import { useMemo } from 'react'
import { Chain } from 'wagmi'

function useBaseApiUrl(chain: Chain) {
  return useMemo(() => {
    if (chain.id === 5) {
      return 'https://api-goerli.reservoir.tools'
    } else {
      return 'https://api.reservoir.tools'
    }
  }, [chain])
}

export default useBaseApiUrl
