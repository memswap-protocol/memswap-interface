import { NextResponse } from 'next/server'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler() {
  let tokens
  let cacheSettings = 'maxage=0, s-maxage=86400 stale-while-revalidate' // Default cache settings

  try {
    const response = await fetch('https://www.gemini.com/uniswap/manifest.json')

    if (!response.ok) {
      console.log('Error fetching token list')
    }

    const data = await response.json()
    tokens = data?.tokens
  } catch (error) {
    console.log('Error fetching token list: ', error)
    tokens = null
    cacheSettings = 'maxage=0, s-maxage=300 stale-while-revalidate' // Reduce cache time if chainlist API fails
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
