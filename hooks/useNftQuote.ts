import useSWR from 'swr'
import { useReservoirBaseApiUrl } from '.'
import { Collection, Token } from '../lib/types'
import useSupportedNetwork from './useSupportedNetwork'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { zeroAddress } from 'viem'
import axios from 'axios'
import { paths } from '@reservoir0x/reservoir-sdk'

const axiosFetcher = async (url: string, params: any) => {
  const { data } = await axios.post(url, params, {
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_RESERVOIR_API_KEY || '',
    },
  })
  return data
}

const useNftQuote = (
  tokenIn?: Token,
  collection?: Collection,
  amountOut?: number
) => {
  const { address } = useAccount()
  const { chain } = useSupportedNetwork()
  const baseApiUrl = useReservoirBaseApiUrl(chain)

  const options = useMemo(() => {
    return {
      items: [
        {
          collection: collection?.id,
          quantity: amountOut || 1,
        },
      ],
      taker: address || zeroAddress,
      currency: tokenIn?.address,
      onlyPath: true,
    }
  }, [address, amountOut, collection, tokenIn?.address])

  const cacheKey = useMemo(() => {
    if (baseApiUrl && collection && amountOut) {
      return [`${baseApiUrl}/execute/buy/v7`, JSON.stringify(options)]
    }
    return null
  }, [baseApiUrl, amountOut, collection, options])

  const { data, isLoading, error } = useSWR<
    paths['/execute/buy/v7']['post']['responses']['200']['schema']
  >(
    cacheKey,
    async ([url]: [string]) => {
      return await axiosFetcher(url, options)
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  )

  const totalQuote = useMemo(() => {
    if (!data) return 0
    return data?.path?.reduce((total, path) => {
      return (
        total +
        Number(
          tokenIn?.address === zeroAddress ? path.quote : path.buyInQuote || '0'
        )
      )
    }, 0)
  }, [data])

  return {
    quote: totalQuote,
    isLoading,
    isError: Boolean(error),
  }
}

export default useNftQuote
