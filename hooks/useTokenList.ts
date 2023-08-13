import { useState, useEffect } from 'react'
import { Token } from '../components/swap/SelectTokenModal'
import { useNetwork } from 'wagmi'
import { chainTokens } from '../constants/chainTokens'

function useTokenList() {
  const { chain: activeChain } = useNetwork()
  const [tokens, setTokens] = useState<Token[] | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/tokenList')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data: { tokens: Token[] } = await response.json()

        const filteredTokens =
          data?.tokens?.filter(
            (token) => token?.chainId === (activeChain?.id || 1)
          ) || []

        setTokens([...chainTokens[activeChain?.id || 1], ...filteredTokens])
      } catch (err: any) {
        setError(err)
        setTokens(chainTokens[activeChain?.id || 1])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [activeChain])

  return { tokens, loading, error }
}

export default useTokenList
