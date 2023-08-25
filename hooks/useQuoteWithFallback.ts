import { FeeAmount } from '@uniswap/v3-sdk'
import { useOneInchQuote, useOnChainUniswapQuote } from '.'
import { Token } from '../types'

const useQuoteWithFallback = (
  amountIn: number,
  feeAmount: FeeAmount,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const {
    quote: oneInchQuote,
    isLoading: oneInchQuoteLoading,
    isError: oneInchQuoteError,
  } = useOneInchQuote(amountIn, tokenIn, tokenOut)

  const {
    quote: onChainUniswapQuote,
    isLoading: onChainUniswapQuoteLoading,
    isError: onChainUniswapQuoteError,
  } = useOnChainUniswapQuote(
    amountIn,
    feeAmount,
    tokenIn,
    oneInchQuoteError ? tokenOut : undefined // don't run hook unless 1inch api fails
  )

  return {
    quote: !oneInchQuoteError ? oneInchQuote : onChainUniswapQuote,
    isLoading: oneInchQuoteLoading || onChainUniswapQuoteLoading,
    isError: oneInchQuoteError && onChainUniswapQuoteError,
  }
}

export default useQuoteWithFallback
