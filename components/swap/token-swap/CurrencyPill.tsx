import { FC } from 'react'
import { Flex, Img, Text } from '../../primitives'
import { Collection, Token } from '../../../lib/types'

type Props = {
  token?: Token | Collection
}

export const CurrencyPill: FC<Props> = ({ token }) => {
  const isCollection = Boolean(token && 'id' in token)
  const image = isCollection
    ? (token as Collection).image
    : (token as Token)?.logoURI
  const altText = isCollection
    ? (token as Collection).name
    : (token as Token)?.name
  const displayText = isCollection
    ? (token as Collection).name
    : (token as Token)?.symbol

  return (
    <Flex
      justify="between"
      css={{
        px: '3',
        py: '2',
        gap: '2',
        maxWidth: 180,
        borderRadius: 99999,
        flexShrink: 0,
        width: 'max-content',
        '--borderColor': 'colors.gray6',
        backgroundColor: 'white',
        border: '1px solid var(--borderColor)',
      }}
    >
      <Img
        src={image || ''}
        alt={altText || ''}
        width={24}
        height={24}
        css={{
          aspectRatio: '1/1',
          borderRadius: '50%',
        }}
      />{' '}
      <Text ellipsify>{displayText}</Text>
    </Flex>
  )
}
