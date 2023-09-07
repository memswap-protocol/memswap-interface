import { FC } from 'react'
import { Flex, Text } from '../../primitives'
import { Token } from '../../../lib/types'

type Props = {
  token?: Token
}

export const CurrencyPill: FC<Props> = ({ token }) => {
  return (
    <Flex
      justify="between"
      css={{
        px: '3',
        py: '2',
        gap: '2',
        borderRadius: 99999,
        flexShrink: 0,
        width: 'max-content',
        '--borderColor': 'colors.gray6',
        backgroundColor: 'white',
        border: '1px solid var(--borderColor)',
      }}
    >
      <img
        src={token?.logoURI || ''}
        alt={token?.name}
        width={24}
        height={24}
        style={{
          aspectRatio: '1/1',
          borderRadius: '50%',
        }}
      />{' '}
      <Text ellipsify>{token?.symbol}</Text>
    </Flex>
  )
}
