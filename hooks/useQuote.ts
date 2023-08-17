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

const useQuote = (
  amountIn: number,
  feeAmount: FeeAmount,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { chain: activeChain } = useNetwork()
  const [quotedAmountOut, setQuotedAmountOut] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const { data: walletClient } = useWalletClient()

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

  const isEthToWethSwap =
    (tokenIn?.address === zeroAddress ||
      tokenIn?.address === WRAPPED_CONTRACTS[activeChain?.id || 1]) &&
    (tokenOut?.address === zeroAddress ||
      tokenOut?.address === WRAPPED_CONTRACTS[activeChain?.id || 1])

  // For ETH, use WETH to feth quote
  const getResolvedAddress = useCallback(
    (address?: string) => {
      return address === zeroAddress
        ? WRAPPED_CONTRACTS[activeChain?.id || 1]
        : address
    },
    [activeChain]
  )

  const resetState = useCallback(() => {
    setIsError(false)
    setIsLoading(false)
    setQuotedAmountOut(undefined)
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
            getResolvedAddress(tokenIn?.address),
            getResolvedAddress(tokenOut?.address),
            feeAmount,
            parseUnits(amountIn.toString(), tokenIn?.decimals || 18),
            0,
          ],
        })

        const quotedAmount = result
          ? formatUnits(result as bigint, tokenOut?.decimals || 18)
          : undefined

        if (!isCancelled) {
          setQuotedAmountOut(quotedAmount)
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
      setQuotedAmountOut(amountIn ? amountIn.toString() : undefined)
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
    getResolvedAddress,
    activeChain,
  ])

  return { quotedAmountOut, isLoading, isError }
}

export default useQuote
