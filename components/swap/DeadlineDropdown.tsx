import { Dispatch, FC, SetStateAction } from 'react'
import { Dropdown } from '../primitives/Dropdown'
import { Button, Text, Flex } from '../primitives'

type Props = {}

export const DeadlineDropdown: FC<Props> = ({}) => {
  return (
    <Dropdown
      trigger={
        <Button
          corners="pill"
          color="gray3"
          size="small"
          css={{
            minHeight: 28,
            width: 118,
          }}
        >
          <Text style="subtitle2" ellipsify></Text>
        </Button>
      }
      contentProps={{ sideOffset: 12, style: { maxWidth: 208 } }}
    >
      <Flex direction="column" css={{ gap: '2' }}>
        <Text style="subtitle2">Swap Deadline e</Text>
      </Flex>
    </Dropdown>
  )
}
