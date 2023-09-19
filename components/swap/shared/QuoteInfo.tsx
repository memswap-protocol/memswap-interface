import { FC } from 'react'
import { Flex, Text } from '../../primitives'
import { LoadingSpinner } from '../../common/LoadingSpinner'
import { formatNumber } from '../../../lib/utils/numbers'
import { Protocol, Token } from '../../../lib/types'

type QuoteInfoProps = {
  isBuy: boolean
  protocol: Protocol
  tokenIn?: Token
  tokenOut?: Token
  amountIn: string
  amountOut: string
  totalEstimatedFees?: number
  isFetchingQuote: boolean
  errorFetchingQuote: boolean
  errorMessage?: string
}

export const QuoteInfo: FC<QuoteInfoProps> = ({
  isBuy,
  protocol,
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  totalEstimatedFees,
  isFetchingQuote,
  errorFetchingQuote,
  errorMessage,
}) => {
  if (
    !tokenIn ||
    (!tokenOut && protocol === Protocol.ERC20) ||
    (!amountIn && !amountOut && (!isFetchingQuote || !errorFetchingQuote))
  ) {
    return
  }
  const bestPrice =
    (Number(amountOut) + Number(totalEstimatedFees)) / Number(amountIn)

  return (
    <Flex
      direction="column"
      css={{
        p: '4',
        gap: '2',
        sm: {
          px: 24,
          py: '4',
        },
        '--borderColor': 'colors.gray6',
        border: '1px solid var(--borderColor)',
        borderRadius: 12,
      }}
    >
      {isFetchingQuote ? (
        <Flex align="center" justify="between">
          <Text style="body2">Fetching Price...</Text>
          <LoadingSpinner />
        </Flex>
      ) : null}

      {!isFetchingQuote && errorFetchingQuote ? (
        <Text style="body2" color="error">
          {errorMessage ?? 'There was an error fetching the quote'}
        </Text>
      ) : null}

      {!isFetchingQuote && !errorFetchingQuote ? (
        <>
          {protocol === Protocol.ERC20 ? (
            <Flex align="center" justify="between" css={{ gap: '4' }}>
              <Text style="body2" css={{ whiteSpace: 'nowrap' }}>
                Best Price
              </Text>
              <Text style="body2" color="subtle" ellipsify>
                1 {tokenIn?.symbol} ={' '}
                {bestPrice ? formatNumber(bestPrice, 8) : 0} {tokenOut?.symbol}
              </Text>
            </Flex>
          ) : null}
          {totalEstimatedFees ? (
            <Flex align="center" justify="between" css={{ gap: '4' }}>
              <Text style="body2" css={{ whiteSpace: 'nowrap' }}>
                Total Estimated Fees
              </Text>
              <Text style="body2" color="subtle" ellipsify>
                ~ {formatNumber(totalEstimatedFees, 6)}{' '}
                {isBuy ? tokenIn?.symbol : tokenOut?.symbol}
              </Text>
            </Flex>
          ) : null}
        </>
      ) : null}
    </Flex>
  )
}
