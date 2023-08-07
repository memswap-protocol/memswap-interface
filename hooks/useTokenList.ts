import { useState, useEffect } from 'react'
import { Token } from '../components/swap/SelectCurrency'

function useTokenList() {
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
        setTokens(data?.tokens)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { tokens, loading, error }
}

export default useTokenList
