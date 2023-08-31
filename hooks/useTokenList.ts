import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useNetwork } from 'wagmi'
import { chainDefaultTokens } from '../constants/chainDefaultTokens'
import fetcher from '../utils/fetcher'
import { Token } from '../types'

/**
 *
 * This hook fetches and saves to local storage a list of tokens from https://tokenlists.org/
 *
 * We can't use Next API routes for caching this request because Next APIs are not compatible
 * with IPFS deployments.
 *
 * Upon the initial load, the hook checks for any pre-existing token list data in local storage.
 * If found, it uses that data to avoid unnecessary network requests.
 *
 * Otherwise, it fetches the list and stores the fetched data in local
 * for future use.
 */
function useTokenList() {
  const { chain: activeChain } = useNetwork()
  const defaultTokens = chainDefaultTokens[activeChain?.id || 1]
  const [localStorageData, setLocalStorageData] = useState<
    { tokens: Token[] } | undefined
  >(undefined)
  const [isLocalStorageDataLoaded, setLocalStorageDataLoaded] = useState(false)

  const storageKey = 'memswap.token.list.v1'

  // Retrieve data from localStorage only on client side
  useEffect(() => {
    const rawData = localStorage.getItem(storageKey)
    if (rawData) {
      setLocalStorageData(JSON.parse(rawData))
    }
    setLocalStorageDataLoaded(true)
  }, [])

  const shouldFetch = isLocalStorageDataLoaded && !localStorageData

  const { data, error } = useSWR<{ tokens: Token[] }>(
    shouldFetch ? 'https://gateway.ipfs.io/ipns/tokens.uniswap.org' : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 86400000,
      fallbackData: localStorageData,
    }
  )

  // Save fetched data to localStorage
  useEffect(() => {
    if (data && !localStorageData) {
      localStorage.setItem(storageKey, JSON.stringify(data))
    }
  }, [data, localStorageData])

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
