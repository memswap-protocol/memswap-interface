import { FeeAmount } from '@uniswap/v3-sdk'
import { Token } from '../components/swap/SelectTokenModal'
import { useOneInchQuote, useOnChainUniswapQuote } from '.'

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

  // console.log('oneInchQuote: ', oneInchQuote)
  // console.log('onChainUniswapQuote: ', onChainUniswapQuote)
  // console.log('-----------------------------')
  // console.log('oneInchQuoteError: ', oneInchQuoteError)

  return {
    quote: !oneInchQuoteError ? oneInchQuote : onChainUniswapQuote,
    isLoading: oneInchQuoteLoading || onChainUniswapQuoteLoading,
    isError: oneInchQuoteError && onChainUniswapQuoteError,
  }
}

export default useQuoteWithFallback
