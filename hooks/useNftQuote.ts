import useSWR from 'swr'
import { useReservoirBaseApiUrl } from '.'
import { Collection, Token } from '../lib/types'
import useSupportedNetwork from './useSupportedNetwork'
import { useEffect, useMemo, useState } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { formatUnits, parseGwei, parseUnits, zeroAddress } from 'viem'
import axios from 'axios'
import { paths } from '@reservoir0x/reservoir-sdk'

// Approximation for gas used by buy logic
const gasUsed = (quantity: number) =>
  350000n + 75000n * BigInt(quantity) + 50000n * BigInt(quantity)

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
  const publicClient = usePublicClient()
  const baseApiUrl = useReservoirBaseApiUrl(chain)
  const [totalEstimatedFees, setTotalEstimatedFees] = useState<
    number | undefined
  >()

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
      refreshInterval: 30000,
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  )

  const quote = useMemo(() => {
    if (!data) return 0
    return data?.path?.reduce((total, path) => {
      return (
        total +
        Number(
          tokenIn?.address === zeroAddress ? path.quote : path.buyInQuote || '0'
        )
      )
    }, 0)
  }, [data, tokenIn])

  // Fetch eth conversion to calculate gas price
  useEffect(() => {
    const calculateTotalEstimatedFees = async () => {
      try {
        const currencyConversion = await axios
          .get<
            paths['/currencies/conversion/v1']['get']['responses']['200']['schema']
          >(
            `${baseApiUrl}/currencies/conversion/v1?from=${zeroAddress}&to=${tokenIn?.address}`
          )
          .then((response) => response.data.conversion)

        const gasFee = await publicClient
          .getBlock({
            blockTag: 'latest',
          })
          // 1 gwei + latest base fee adjusted up by 30%
          .then(
            (b) => parseGwei('1', 'wei') + (b.baseFeePerGas! * 13000n) / 10000n
          )

        const tokenInDecimals = tokenIn?.decimals ?? 18
        const estimatedFees = formatUnits(
          (BigInt(parseUnits(currencyConversion ?? '1', tokenInDecimals)) *
            gasUsed(amountOut ?? 1) *
            gasFee) /
            10n ** 18n,
          tokenInDecimals
        )

        setTotalEstimatedFees(Number(estimatedFees))
      } catch (error) {
        setTotalEstimatedFees(undefined)
      }
    }

    calculateTotalEstimatedFees()
  }, [amountOut, tokenIn?.address, tokenIn?.decimals, baseApiUrl]) // Add any other dependencies if needed

  const totalQuote = useMemo(() => {
    return (quote ?? 0) + (totalEstimatedFees ?? 0)
  }, [quote, totalEstimatedFees])

  return {
    quote: totalQuote,
    totalEstimatedFees,
    isLoading,
    isError: Boolean(error),
    error,
  }
}

export default useNftQuote
