import { useCallback, useEffect, useState } from 'react'
import {
  AlphaRouter,
  CurrencyAmount,
  SwapType,
} from '@uniswap/smart-order-router'
import { Protocol } from '@uniswap/router-sdk'
import { Token } from '../types'
import { formatGwei, parseUnits } from 'viem'
import { createUniswapToken, useIsEthToWethSwap } from '../utils/quote'
import { Percent, TradeType } from '@uniswap/sdk-core'
import useSupportedNetwork from './useSupportedNetwork'
import { hexToString, hexToNumber } from 'viem'

// Approximation for gas used by swap logic
const defaultGas = 200000n

const useQuote = (
  router: AlphaRouter,
  amountIn: number,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { chain } = useSupportedNetwork()
  const [quote, setQuote] = useState<string | undefined>()
  const [estimatedGasUsed, setEstimatedGasUsed] = useState<string | undefined>()
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
    setEstimatedGasUsed(undefined)
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

        console.log(
          'Estimated gas used: ',
          route?.estimatedGasUsedQuoteToken.toSignificant(8)
        )

        console.log(route)

        const fetchedQuote = Number(route?.quote?.toSignificant(8))
        const fetchedEstimatedGasUsed = Number(
          route?.estimatedGasUsedQuoteToken.toSignificant(8)
        )
        const totalEstimatedGasUsed =
          Number(formatGwei(defaultGas, 'wei')) + fetchedEstimatedGasUsed
        const totalQuote = fetchedQuote - totalEstimatedGasUsed

        console.log('Total quote: ', totalQuote)

        if (!isCancelled) {
          setQuote(route?.quote?.toSignificant(8))
          setEstimatedGasUsed(fetchedEstimatedGasUsed?.toString())
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
    estimatedGasUsed,
    isLoading,
    isError,
  }
}

export default useQuote
