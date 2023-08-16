import { useState, useEffect } from 'react'
import { Token } from '../components/swap/SelectTokenModal'
import { useNetwork } from 'wagmi'
import { chainDefaultTokens } from '../constants/chainDefaultTokens'

function useTokenList() {
  const { chain: activeChain } = useNetwork()
  const [tokens, setTokens] = useState<Token[] | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  const defaultTokens = chainDefaultTokens[activeChain?.id || 1]

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const response = await fetch('/api/tokenList')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data: { tokens: Token[] } = await response.json()

        const filteredTokens =
          data?.tokens?.filter(
            (token) =>
              token?.chainId === (activeChain?.id || 1) &&
              !defaultTokens.some(
                (defaultToken) => defaultToken.address === token.address
              )
          ) || []

        setTokens([...defaultTokens, ...filteredTokens])
      } catch (err: any) {
        setError(err)
        setTokens(defaultTokens)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [activeChain, defaultTokens])

  return { tokens, loading, error }
}

export default useTokenList
