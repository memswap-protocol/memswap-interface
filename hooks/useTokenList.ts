import { useMemo } from 'react'
import useSWR from 'swr'
import { Token } from '../components/swap/SelectTokenModal'
import { useNetwork } from 'wagmi'
import { chainDefaultTokens } from '../constants/chainDefaultTokens'
import fetcher from '../utils/fetcher'

function useTokenList() {
  const { chain: activeChain } = useNetwork()
  const defaultTokens = chainDefaultTokens[activeChain?.id || 1]

  const { data, error } = useSWR<{ tokens: Token[] }>('/api/tokenList', fetcher)

  const tokens = useMemo(() => {
    if (!data) return defaultTokens

    const filteredTokens = data.tokens.filter(
      (token) =>
        token.chainId === (activeChain?.id || 1) &&
        !defaultTokens.some(
          (defaultToken) => defaultToken.address === token.address
        )
    )

    return [...defaultTokens, ...filteredTokens]
  }, [data, defaultTokens, activeChain])

  return {
    tokens,
    loading: !data && !error,
    error,
  }
}

export default useTokenList
