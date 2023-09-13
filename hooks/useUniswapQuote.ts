import { useCallback, useEffect, useState } from 'react'
import {
  AlphaRouter,
  CurrencyAmount,
  SwapType,
} from '@uniswap/smart-order-router'
import { Protocol } from '@uniswap/router-sdk'
import { Token } from '../lib/types'
import { formatGwei, parseUnits } from 'viem'
import { createUniswapToken, useIsEthToWethSwap } from '../lib/utils/quote'
import { Percent, TradeType } from '@uniswap/sdk-core'
import useSupportedNetwork from './useSupportedNetwork'

// Approximation for gas used by swap logic
const defaultGas = 200000n

/**
 * useUniswapQuote - A React hook for fetching and managing quotes from uniswap's smart order router.
 *
 * @param {AlphaRouter} router - The Uniswap AlphaRouter to route the trade.
 * @param {boolean} isBuy - A flag indicating if the trade is a buy or sell.
 * @param {number} amountIn - The input amount for the trade.
 * @param {number} amountOut - The output amount for the trade.
 * @param {Token} [tokenIn] - The input token.
 * @param {Token} [tokenOut] - The output token.
 *
 **/

const useUniswapQuote = (
  router: AlphaRouter,
  isBuy: boolean,
  amountIn: number,
  amountOut: number,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { chain } = useSupportedNetwork()
  const [totalQuote, setTotalQuote] = useState<string | undefined>()
  const [rawQuote, setRawQuote] = useState<string | undefined>()
  const [totalEstimatedFees, setTotalEstimatedFees] = useState<
    string | undefined
  >()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isHighGasFee, setIsHighGasFee] = useState(false)
  const [isAutoUpdate, setIsAutoUpdate] = useState(false) // Used to ignore an automatic refresh that could be triggered by amountIn or amountOut
  const [shouldRefresh, setShouldRefresh] = useState(false) // Setter to trigger a manual quote refresh

  const isEthToWethSwap = useIsEthToWethSwap(
    tokenIn?.address,
    tokenOut?.address,
    chain
  )

  const resetState = useCallback(() => {
    setIsLoading(false)
    setIsError(false)
    setIsHighGasFee(false)
  }, [])

  useEffect(() => {
    let isCancelled = false

    const fetchQuote = async () => {
      try {
        setIsLoading(true)
        setIsError(false)

        const fromToken = createUniswapToken(tokenIn!, chain.id)
        const toToken = createUniswapToken(tokenOut!, chain.id)

        let route

        if (isBuy) {
          const parsedAmountOut = parseUnits(
            amountOut.toString(),
            tokenOut?.decimals ?? 18
          ).toString()

          route = await router!.route(
            CurrencyAmount.fromRawAmount(toToken, parsedAmountOut),
            fromToken,
            TradeType.EXACT_OUTPUT,
            {
              type: SwapType.UNIVERSAL_ROUTER,
              slippageTolerance: new Percent(1, 100),
            },
            {
              protocols: [Protocol.V3, Protocol.V2],
            }
          )
        } else {
          const parsedAmountIn = parseUnits(
            amountIn.toString(),
            tokenIn?.decimals ?? 18
          ).toString()

          route = await router!.route(
            CurrencyAmount.fromRawAmount(fromToken, parsedAmountIn),
            toToken,
            TradeType.EXACT_INPUT,
            {
              type: SwapType.UNIVERSAL_ROUTER,
              slippageTolerance: new Percent(1, 100),
            },
            {
              protocols: [Protocol.V3, Protocol.V2],
            }
          )
        }

        if (
          !route?.quote?.toExact() ||
          !route?.estimatedGasUsedQuoteToken.toExact()
        ) {
          throw new Error('Missing quote or estimated gas information')
        }

        const fetchedQuote = Number(route?.quote?.toExact())
        const fetchedEstimatedGasUsed = Number(
          route?.estimatedGasUsedQuoteToken.toExact()
        )

        const totalEstimatedGasUsed =
          Number(formatGwei(defaultGas, 'wei')) + fetchedEstimatedGasUsed
        const totalQuote = Math.max(fetchedQuote - totalEstimatedGasUsed, 0)

        if (!isCancelled) {
          setTotalQuote(totalQuote.toString())
          setRawQuote(fetchedQuote.toString())
          setTotalEstimatedFees(totalEstimatedGasUsed.toString())
          setIsLoading(false)

          // Check if the gas fees exceed 30% of the total quote
          const gasFeePercentage = (totalEstimatedGasUsed / totalQuote) * 100
          setIsHighGasFee(gasFeePercentage > 30)
        }
      } catch (error) {
        console.error(error)
        if (!isCancelled) {
          resetState()
          setIsError(true)
        }
      }
    }

    if ((isBuy && !amountOut) || (!isBuy && !amountIn)) {
      resetState()
      setTotalQuote('')
      setRawQuote('')
      setTotalEstimatedFees('')
      return
    }

    if (isEthToWethSwap || tokenIn?.address === tokenOut?.address) {
      resetState()
      if (isBuy) {
        setTotalQuote(amountOut ? amountOut.toString() : undefined)
        setRawQuote(amountOut ? amountOut.toString() : undefined)
      } else {
        setTotalQuote(amountIn ? amountIn.toString() : undefined)
        setRawQuote(amountIn ? amountIn.toString() : undefined)
      }
      setTotalEstimatedFees('')
      return
    }

    // If the required conditions are not met, reset state.
    if (!tokenIn || !tokenOut || !router) {
      resetState()
      return
    }

    if (shouldRefresh) {
      resetState()
      fetchQuote()
      setShouldRefresh(false) // Reset it back to false
      return
    }

    if (isAutoUpdate) {
      setIsAutoUpdate(false)
      return
    }

    // If all conditions are met, fetch the quote.
    fetchQuote()

    return () => {
      isCancelled = true
    }
  }, [
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    shouldRefresh,
    router,
    isEthToWethSwap,
    chain?.id,
    resetState,
  ])

  return {
    totalQuote,
    rawQuote,
    totalEstimatedFees,
    isLoading,
    isError,
    isHighGasFee,
    setIsAutoUpdate,
    setShouldRefresh,
  }
}

export default useUniswapQuote
