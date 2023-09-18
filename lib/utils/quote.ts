import { parseUnits, zeroAddress } from 'viem'
import { WRAPPED_CONTRACTS } from '../constants/contracts'
import { useNetwork } from 'wagmi'
import { Token } from '../types'
import { Protocol } from '@uniswap/router-sdk'
import {
  CurrencyAmount,
  Ether,
  Percent,
  TradeType,
  Token as UniswapToken,
} from '@uniswap/sdk-core'
import { AlphaRouter, SwapType } from '@uniswap/smart-order-router'

// Approximation for gas used by memswap logic
const defaultGas = 250000n

/**
 * fetchQuote - A function for fetching quotes from uniswap's smart order router.
 *
 * @param {number} chainId - The chainId.
 * @param {AlphaRouter} router - The Uniswap AlphaRouter to route the trade.
 * @param {boolean} isBuy - A flag indicating if the trade is a buy or sell.
 * @param {number} amountIn - The input amount for the trade.
 * @param {number} amountOut - The output amount for the trade.
 * @param {Token} [tokenIn] - The input token.
 * @param {Token} [tokenOut] - The output token.
 *
 **/
export const fetchQuote = async (
  chainId: number,
  router: AlphaRouter,
  isBuy: boolean,
  amountIn: number,
  amountOut: number,
  tokenIn: Token,
  tokenOut: Token
) => {
  try {
    const fromToken = createUniswapToken(tokenIn, chainId)
    const toToken = createUniswapToken(tokenOut, chainId)

    let route

    if (isBuy) {
      const parsedAmountOut = parseUnits(
        amountOut.toString(),
        tokenOut?.decimals ?? 18
      ).toString()

      route = await router.route(
        CurrencyAmount.fromRawAmount(toToken, parsedAmountOut),
        fromToken,
        TradeType.EXACT_OUTPUT,
        {
          type: SwapType.UNIVERSAL_ROUTER,
          slippageTolerance: new Percent(1, 100),
        },
        {
          protocols: [Protocol.V3, Protocol.V2],
        }
      )
    } else {
      const parsedAmountIn = parseUnits(
        amountIn.toString(),
        tokenIn?.decimals ?? 18
      ).toString()

      route = await router.route(
        CurrencyAmount.fromRawAmount(fromToken, parsedAmountIn),
        toToken,
        TradeType.EXACT_INPUT,
        {
          type: SwapType.UNIVERSAL_ROUTER,
          slippageTolerance: new Percent(1, 100),
        },
        {
          protocols: [Protocol.V3, Protocol.V2],
        }
      )
    }

    if (
      !route?.quote?.toExact() ||
      !route?.estimatedGasUsedQuoteToken.toExact()
    ) {
      throw new Error('Missing quote or estimated gas information')
    }

    const fetchedQuote = Number(route?.quote?.toExact())
    const fetchedEstimatedGasUsed = Number(
      route?.estimatedGasUsedQuoteToken.toExact()
    )

    // UniswapGasUsed ...................... EstimatedGasUsedQuoteToken
    // UniswapGasUsed + DefaultGasUsed ..... ? TotalEstimatedFees ?
    let totalEstimatedFees =
      ((Number(defaultGas) + route?.estimatedGasUsed.toNumber()) *
        fetchedEstimatedGasUsed) /
      route?.estimatedGasUsed.toNumber()

    // Adjust the estimated fees used by 15% just in case
    totalEstimatedFees += totalEstimatedFees / 15

    const totalQuote = isBuy
      ? // For buy orders, adjust the quote up
        fetchedQuote + totalEstimatedFees
      : // For sell orders, adjust the quote down
        Math.max(fetchedQuote - totalEstimatedFees, 0)

    // Check if the gas fees exceed 30% of the total quote
    const gasFeePercentage = (totalEstimatedFees / totalQuote) * 100
    const isHighGasFee = gasFeePercentage > 30

    return {
      totalQuote: totalQuote.toString(),
      rawQuote: fetchedQuote.toString(),
      totalEstimatedFees,
      isError: false,
      isHighGasFee,
    }
  } catch (error) {
    console.error(error)
    return {
      totalQuote: undefined,
      rawQuote: undefined,
      totalEstimatedFees: undefined,
      isError: true,
      isHighGasFee: false,
    }
  }
}

export const createUniswapToken = (token: Token, chainId: number) => {
  if (token?.address === zeroAddress) {
    return Ether.onChain(chainId)
  } else {
    return new UniswapToken(
      token.chainId,
      token.address,
      token.decimals,
      token.symbol,
      token.name
    )
  }
}

export const useIsEthToWethSwap = (
  addressIn?: string,
  addressOut?: string,
  activeChain?: ReturnType<typeof useNetwork>['chain']
): boolean => {
  return (
    (addressIn === zeroAddress ||
      addressIn === WRAPPED_CONTRACTS[activeChain?.id || 1]) &&
    (addressOut === zeroAddress ||
      addressOut === WRAPPED_CONTRACTS[activeChain?.id || 1])
  )
}
