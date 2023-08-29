import { useCallback, useEffect, useMemo, useState } from 'react'
import { providers } from 'ethers'
import {
  AlphaRouter,
  CurrencyAmount,
  LegacyRouter,
  SwapType,
} from '@uniswap/smart-order-router'
import { Protocol } from '@uniswap/router-sdk'
import { mainnet, useNetwork, useWalletClient } from 'wagmi'
import { Token } from '../types'
import { createPublicClient, http, parseUnits } from 'viem'
import { createUniswapToken, useIsEthToWethSwap } from '../utils/quote'
import { Percent, TradeType } from '@uniswap/sdk-core'
import { useEthersProvider } from '../utils/ethersAdapter'

const useQuote = (amountIn: number, tokenIn?: Token, tokenOut?: Token) => {
  const { chain } = useNetwork()
  const { data: walletClient } = useWalletClient()
  const [quote, setQuote] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const rpcUrl =
    chain?.rpcUrls?.alchemy?.http[0] || 'https://eth-mainnet.g.alchemy.com/v2'

  // @TODO: Alpha router fails when a fallback provider is used. The ethers adapter uses a fallback
  // provider, so need to think about the best way to move forward

  // Ethers provider
  const ethersProvider = useMemo(() => {
    return new providers.JsonRpcProvider(
      `${rpcUrl}/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    )
  }, [rpcUrl])

  // const provider = useEthersProvider()

  const router = useMemo(() => {
    return new AlphaRouter({
      chainId: chain?.id || 1,
      provider: ethersProvider,
    })
  }, [chain, ethersProvider])

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
            slippageTolerance: new Percent(5, 100), //@TODO: pass custom slippage
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
