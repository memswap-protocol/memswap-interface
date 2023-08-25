import useSWR from 'swr'
import fetcher from '../utils/fetcher'
import { formatUnits, parseUnits } from 'viem'
import { buildQueryString } from '../utils/params'
import { resolveTokenAddress, useIsEthToWethSwap } from '../utils/quote'
import { useNetwork } from 'wagmi'
import { Token } from '../types'

type QuoteResponse = {
  toAmount: string
}

const useOneInchQuote = (
  amountIn: number,
  tokenIn?: Token,
  tokenOut?: Token
) => {
  const { chain: activeChain } = useNetwork()
  const query = {
    amount: parseUnits(amountIn.toString(), tokenIn?.decimals || 18).toString(),
    src: resolveTokenAddress(tokenIn?.address, activeChain),
    dst: resolveTokenAddress(tokenOut?.address, activeChain),
  }

  const queryString = buildQueryString(query)
  const url = `/api/getOneInchQuote?${queryString}`

  const isEthToWethSwap = useIsEthToWethSwap(
    tokenIn?.address,
    tokenOut?.address,
    activeChain
  )

  const isOnMainnet = activeChain?.id !== 5

  const enabled = Boolean(
    isOnMainnet &&
      amountIn &&
      tokenIn &&
      tokenOut &&
      !isEthToWethSwap &&
      !(tokenIn?.address === tokenOut?.address)
  )

  const { data, error } = useSWR<QuoteResponse>(
    enabled ? [url] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  )

  let quote = data?.toAmount
    ? formatUnits(BigInt(data?.toAmount), tokenOut?.decimals || 18)
    : undefined

  if (isEthToWethSwap || tokenIn?.address === tokenOut?.address) {
    quote = amountIn.toString()
  }

  return {
    quote: quote,
    isLoading: !error && !data && enabled,
    isError: error || !isOnMainnet, // if on mainnet, set isError to true, so useQuoteWithFallback will fetch the quote onchain
  }
}

export default useOneInchQuote
