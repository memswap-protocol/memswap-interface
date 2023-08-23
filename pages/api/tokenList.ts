import { NextResponse } from 'next/server'
import { Token } from '../../components/swap/SelectTokenModal'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler() {
  let tokens: Token[]
  let cacheSettings = 'maxage=0, s-maxage=86400 stale-while-revalidate' // Default cache settings

  try {
    const response = await fetch(
      'https://gateway.ipfs.io/ipns/tokens.uniswap.org'
    )

    if (!response.ok) {
      throw Error('Error fetching token list')
    }

    const data = await response.json()
    tokens = data?.tokens
  } catch (error) {
    console.error('Error fetching token list: ', error)
    tokens = []
    cacheSettings = 'maxage=0, s-maxage=300 stale-while-revalidate' // Reduce cache time if token list API fails
  }
  return new NextResponse(
    JSON.stringify({
      tokens,
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'Cache-Control': cacheSettings,
      },
    }
  )
}
