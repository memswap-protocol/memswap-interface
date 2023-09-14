import { AlphaRouter } from '@uniswap/smart-order-router'
import useSWR from 'swr'
import { Token } from '../lib/types'
import useSupportedNetwork from './useSupportedNetwork'
import { fetchQuote, useIsEthToWethSwap } from '../lib/utils/quote'

const useUniswapQuote = (
  router: AlphaRouter,
  isBuy: boolean,
  amountIn: number,
  amountOut: number,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { chain } = useSupportedNetwork()
  const isEthToWethSwap = useIsEthToWethSwap(
    tokenIn?.address,
    tokenOut?.address,
    chain
  )

  const fetcherEnabled = Boolean(
    tokenIn &&
      tokenOut &&
      router &&
      (isBuy ? amountOut > 0 : amountIn > 0) &&
      !isEthToWethSwap
  )

  const fetcher = fetcherEnabled
    ? () =>
        fetchQuote(
          chain.id,
          router,
          isBuy,
          amountIn,
          amountOut,
          tokenIn!,
          tokenOut!
        )
    : null

  const { data, error, mutate } = useSWR(
    fetcherEnabled
      ? [
          'uniswapQuote',
          chain.id,
          router,
          isBuy,
          isBuy ? amountOut : amountIn,
          tokenIn,
          tokenOut,
        ]
      : null,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  )

  const isLoading = !data && !error && fetcherEnabled
  const isError = error || data?.isError

  let totalQuote = data?.totalQuote
  let rawQuote = data?.rawQuote
  let totalEstimatedFees = data?.totalEstimatedFees

  // Handle special cases
  if ((isBuy && !amountOut) || (!isBuy && !amountIn)) {
    totalQuote = rawQuote = totalEstimatedFees = undefined
  }

  if (isEthToWethSwap || tokenIn?.address === tokenOut?.address) {
    if (isBuy) {
      totalQuote = rawQuote = amountOut ? amountOut.toString() : undefined
    } else {
      totalQuote = rawQuote = amountIn ? amountIn.toString() : undefined
    }
    totalEstimatedFees = ''
  }

  return {
    totalQuote,
    rawQuote,
    totalEstimatedFees,
    isHighGasFee: data?.isHighGasFee,
    isLoading,
    isError,
    isEthToWethSwap,
    refresh: () => mutate(), // Manually trigger a revalidation if needed
  }
}

export default useUniswapQuote
