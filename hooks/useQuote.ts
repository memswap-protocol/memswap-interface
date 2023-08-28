import { useCallback, useEffect, useMemo, useState } from 'react'
import { providers } from 'ethers'
import {
  AlphaRouter,
  CurrencyAmount,
  SwapType,
} from '@uniswap/smart-order-router'
import { useNetwork } from 'wagmi'
import { Token } from '../types'
import { parseUnits } from 'viem'
import { createUniswapToken, useIsEthToWethSwap } from '../utils/quote'
import { Percent, TradeType } from '@uniswap/sdk-core'

const useQuote = (amountIn: number, tokenIn?: Token, tokenOut?: Token) => {
  const { chain } = useNetwork()
  const [quote, setQuote] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const rpcUrl =
    chain?.rpcUrls?.alchemy?.http[0] || 'https://eth-mainnet.g.alchemy.com/v2'

  // Ethers provider
  const provider = useMemo(() => {
    return new providers.JsonRpcProvider(
      `${rpcUrl}/${process.env.NEXT_PUBLIC_ALCHECMY_API_KEY}`
    )
  }, [rpcUrl])

  const router = useMemo(() => {
    return new AlphaRouter({
      chainId: chain?.id || 1,
      provider: provider as any,
    })
  }, [chain, provider])

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

        const route = await router.route(
          CurrencyAmount.fromRawAmount(fromToken, parsedAmountIn),
          toToken,
          TradeType.EXACT_INPUT,
          {
            type: SwapType.UNIVERSAL_ROUTER,
            slippageTolerance: new Percent(5, 100), //@TODO: pass custom slippage
          },
          {}
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
    if (!tokenIn || !tokenOut || !amountIn) {
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
