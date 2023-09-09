import { FC } from 'react'
import { Flex, Text } from '../../primitives'
import { LoadingSpinner } from '../../common/LoadingSpinner'
import { formatNumber } from '../../../lib/utils/numbers'
import { Collection, Token } from '../../../lib/types'

type QuoteInfoProps = {
  tokenIn?: Token
  tokenOut?: Token | Collection
  amountIn: string
  amountOut: string
  isFetchingQuote: boolean
  errorFetchingQuote: boolean
}

export const QuoteInfo: FC<QuoteInfoProps> = ({
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  isFetchingQuote,
  errorFetchingQuote,
}) => {
  if (
    !tokenIn ||
    !tokenOut ||
    (!amountIn && !amountOut && (!isFetchingQuote || !errorFetchingQuote))
  ) {
    return
  }
  const bestPrice = Number(amountOut) / Number(amountIn)

  return (
    <Flex
      direction="column"
      css={{
        p: '4',
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
          There was an error fetching the quote
        </Text>
      ) : null}

      {!isFetchingQuote && !errorFetchingQuote ? (
        <Flex align="center" justify="between" css={{ gap: '4' }}>
          <Text style="body2">Best Price</Text>
          <Text style="body2" color="subtle" ellipsify>
            1 {tokenIn?.symbol} = {formatNumber(bestPrice, 8)}{' '}
            {tokenOut && 'symbol' in tokenOut
              ? tokenOut?.symbol
              : tokenOut?.name}
          </Text>
        </Flex>
      ) : null}
    </Flex>
  )
}
