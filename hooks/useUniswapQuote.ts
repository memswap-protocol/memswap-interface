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

const useUniswapQuote = (
  router: AlphaRouter,
  amountIn: number,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { chain } = useSupportedNetwork()
  const [quote, setQuote] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

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

        const parsedAmountIn = parseUnits(
          amountIn.toString(),
          tokenIn?.decimals || 18
        ).toString()

        const fromToken = createUniswapToken(tokenIn!, chain.id)
        const toToken = createUniswapToken(tokenOut!, chain.id)

        const route = await router!.route(
          CurrencyAmount.fromRawAmount(fromToken, parsedAmountIn),
          toToken,
          TradeType.EXACT_INPUT,
          {
            type: SwapType.UNIVERSAL_ROUTER,
            slippageTolerance: new Percent(5, 100),
          },
          {
            protocols: [Protocol.V3, Protocol.V2],
          }
        )

        const fetchedQuote = Number(route?.quote?.toExact())
        const fetchedEstimatedGasUsed = Number(
          route?.estimatedGasUsedQuoteToken.toExact()
        )

        const totalEstimatedGasUsed =
          Number(formatGwei(defaultGas, 'wei')) + fetchedEstimatedGasUsed

        const totalQuote = Math.max(fetchedQuote - totalEstimatedGasUsed, 0)

        if (!isCancelled) {
          setQuote(totalQuote.toString())
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

export default useUniswapQuote
