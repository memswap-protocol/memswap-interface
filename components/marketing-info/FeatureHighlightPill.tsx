import { FC } from 'react'
import { Box, Flex, Text } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

type FeatureHighlightPillProps = {
  text: string
}

export const FeatureHighlightPill: FC<FeatureHighlightPillProps> = ({
  text,
}) => {
  return (
    <Flex
      align="center"
      css={{
        px: '3',
        py: '2',
        gap: '2',
        borderRadius: 99999,
        backgroundColor: 'gray3',
      }}
    >
      <Box css={{ color: 'primary10' }}>
        <FontAwesomeIcon icon={faCircleCheck} />
      </Box>
      <Text style="subtitle2">{text}</Text>
    </Flex>
  )
}
