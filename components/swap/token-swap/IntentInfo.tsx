import { FC } from 'react'
import { Flex, Text, Box } from '../../primitives'
import { formatNumber } from '../../../lib/utils/numbers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CurrencyPill } from './CurrencyPill'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Collection, Token } from '../../../lib/types'

type IntentInfoProps = {
  tokenIn?: Token
  tokenOut?: Token | Collection
  amountIn: string
  amountOut: string
}

export const IntentInfo: FC<IntentInfoProps> = ({
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
}) => {
  return (
    <Flex align="center" css={{ gap: '3', sm: { gap: 24 }, pb: '3' }}>
      <Flex align="center" css={{ gap: '2' }}>
        <Text style="h6" ellipsify>
          {formatNumber(amountIn, 8)}
        </Text>
        <CurrencyPill token={tokenIn} />
      </Flex>
      <Box css={{ color: 'gray9' }}>
        <FontAwesomeIcon icon={faChevronRight} width={10} />
      </Box>
      <Flex align="center" css={{ gap: '2' }}>
        <Text style="h6" ellipsify>
          {formatNumber(amountOut, 8)}
        </Text>
        <CurrencyPill token={tokenOut} />
      </Flex>
    </Flex>
  )
}
