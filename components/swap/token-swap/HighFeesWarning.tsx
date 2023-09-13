import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Flex, Text } from '../../primitives'
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'

export const HighFeesWarning = () => {
  return (
    <Flex
      align="center"
      css={{
        p: '4',
        sm: {
          px: 24,
          py: '4',
        },
        '--borderColor': 'colors.red6',
        border: '1px solid var(--borderColor)',
        borderRadius: 12,
        backgroundColor: 'red5',
        gap: '4',
      }}
    >
      <Flex css={{ color: 'red10' }}>
        <FontAwesomeIcon icon={faTriangleExclamation} size="1x" />
      </Flex>
      <Text style="subtitle2">Fees exceed 30% of the swap amount</Text>
    </Flex>
  )
}
