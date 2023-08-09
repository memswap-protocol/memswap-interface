import { FC } from 'react'
import { Flex, Text } from '../primitives'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { Token } from './SelectTokenModal'
import { formatNumber } from '../../utils/numbers'

type Props = {
  quotedAmountOut?: string
  tokenIn?: Token
  tokenOut?: Token
  amountIn: string
  amountOut: string
  isFetchingQuote: boolean
  errorFetchingQuote: boolean
}

export const QuoteInfo: FC<Props> = ({
  quotedAmountOut,
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  isFetchingQuote,
  errorFetchingQuote,
}) => {
  if (!quotedAmountOut && !isFetchingQuote && !errorFetchingQuote) {
    return
  }

  const bestPrice = Number(amountOut) / Number(amountIn)

  return (
    <Flex
      direction="column"
      css={{
        p: 24,
        '--borderColor': 'colors.gray6',
        border: '1px solid var(--borderColor)',
        borderRadius: 12,
      }}
    >
      {isFetchingQuote ? (
        <Flex align="center" justify="between">
          <Text style="body1">Fetching Price</Text>
          <LoadingSpinner />
        </Flex>
      ) : null}

      {errorFetchingQuote ? (
        <Text style="body1" color="error">
          There was an error fetching the quote
        </Text>
      ) : null}

      {quotedAmountOut ? (
        <Flex align="center" justify="between" css={{ gap: '4' }}>
          <Text style="body1">Best Price</Text>
          <Text style="body1" color="subtle">
            1 {tokenIn?.symbol} = {formatNumber(bestPrice, 8)}{' '}
            {tokenOut?.symbol}
          </Text>
        </Flex>
      ) : null}
    </Flex>
  )
}
