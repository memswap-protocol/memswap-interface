import { useCallback, useEffect, useState } from 'react'
import {
  AlphaRouter,
  CurrencyAmount,
  SwapType,
} from '@uniswap/smart-order-router'
import { Protocol } from '@uniswap/router-sdk'
import { Token } from '../types'
import { parseUnits } from 'viem'
import { createUniswapToken, useIsEthToWethSwap } from '../utils/quote'
import { Percent, TradeType } from '@uniswap/sdk-core'
import useSupportedNetwork from './useSupportedNetwork'

const useQuote = (
  router: AlphaRouter,
  amountIn: number,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { chain } = useSupportedNetwork()
  const [quote, setQuote] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const parsedAmountIn = parseUnits(
    amountIn.toString(),
    tokenIn?.decimals || 18
  ).toString()

  const isEthToWethSwap = useIsEthToWethSwap(
    tokenIn?.address,
    tokenOut?.address,
    chain
  )

  const resetState = useCallback(() => {
    setIsError(false)
    setIsLoading(false)
    setQuote(undefined)
  }, [])

  useEffect(() => {
    let isCancelled = false

    const fetchQuote = async () => {
      try {
        setIsLoading(true)
        setIsError(false)

        const fromToken = createUniswapToken(tokenIn!, chain?.id || 1)
        const toToken = createUniswapToken(tokenOut!, chain?.id || 1)

        const route = await router!.route(
          CurrencyAmount.fromRawAmount(fromToken, parsedAmountIn),
          toToken,
          TradeType.EXACT_INPUT,
          {
            type: SwapType.UNIVERSAL_ROUTER,
            slippageTolerance: new Percent(5, 100),
          },
          {
            protocols: [Protocol.V3],
          }
        )

        const fetchedQuote = route?.quote?.toSignificant(8)

        if (!isCancelled) {
          setQuote(fetchedQuote)
          setIsLoading(false)
        }
      } catch (error) {
        console.error(error)
        if (!isCancelled) {
          resetState()
          setIsError(true)
        }
      }
    }

    if (isEthToWethSwap || tokenIn?.address === tokenOut?.address) {
      resetState()
      setQuote(amountIn ? amountIn.toString() : undefined)
      return
    }

    // If the required conditions are not met, reset state.
    if (!tokenIn || !tokenOut || !amountIn || !router) {
      resetState()
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
    parsedAmountIn,
    router,
    isEthToWethSwap,
    chain?.id,
    resetState,
  ])

  return {
    quote,
    isLoading,
    isError,
  }
}

export default useQuote
