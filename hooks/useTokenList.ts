import { useState, useEffect } from 'react'
import { Currency } from '../components/swap/SelectCurrency'

function useTokenList() {
  const [tokens, setTokens] = useState<Currency[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/tokenList')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data: { tokens: Currency[] } = await response.json()
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
