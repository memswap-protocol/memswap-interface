import { useCallback, useEffect, useState } from 'react'
import {
  createPublicClient,
  custom,
  fallback,
  formatUnits,
  http,
  parseUnits,
  zeroAddress,
} from 'viem'
import * as allChains from 'viem/chains'
import { useNetwork, useWalletClient } from 'wagmi'
import { Token } from '../components/swap/SelectTokenModal'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import { FeeAmount } from '@uniswap/v3-sdk'
import { WRAPPED_CONTRACTS, QUOTER_CONTRACT } from '../constants/contracts'
import { resolveTokenAddress, useIsEthToWethSwap } from '../utils/quote'

const useOnChainUniswapQuote = (
  amountIn: number,
  feeAmount: FeeAmount,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { chain: activeChain } = useNetwork()
  const { data: walletClient } = useWalletClient()
  const [quote, setQuote] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const viemChain =
    Object.values(allChains).find(
      (chain) => chain.id === (activeChain?.id || 1)
    ) || allChains.mainnet

  const publicClient = createPublicClient({
    chain: viemChain,
    transport: walletClient?.transport
      ? fallback([custom(walletClient?.transport), http()])
      : http(),
  })

  const isEthToWethSwap = useIsEthToWethSwap(
    tokenIn?.address,
    tokenOut?.address,
    activeChain
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
        const { result } = await publicClient.simulateContract({
          address: QUOTER_CONTRACT,
          abi: Quoter.abi,
          functionName: 'quoteExactInputSingle',
          account: zeroAddress,
          args: [
            resolveTokenAddress(tokenIn?.address, activeChain),
            resolveTokenAddress(tokenOut?.address, activeChain),
            feeAmount,
            parseUnits(amountIn.toString(), tokenIn?.decimals || 18),
            0,
          ],
        })

        const quotedAmount = result
          ? formatUnits(result as bigint, tokenOut?.decimals || 18)
          : undefined

        if (!isCancelled) {
          setQuote(quotedAmount)
          setIsLoading(false)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error(error)
          resetState()
          setIsError(true)
        }
      }
    }

    if (isEthToWethSwap || tokenIn?.address === tokenOut?.address) {
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

    // Cleanup function.
    return () => {
      isCancelled = true
      resetState()
    }
  }, [
    amountIn,
    tokenIn,
    tokenOut,
    isEthToWethSwap,
    feeAmount,
    resolveTokenAddress,
    activeChain,
  ])

  return { quote, isLoading, isError }
}

export default useOnChainUniswapQuote
