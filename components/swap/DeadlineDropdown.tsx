import { Dispatch, FC, SetStateAction } from 'react'
import { Dropdown, DropdownMenuItem } from '../primitives/Dropdown'
import { Button, Text, Flex } from '../primitives'

type Props = {
  deadline: number
  setDeadline: Dispatch<SetStateAction<number>>
}

type DeadlineInfo = {
  text: string
  mins: string
  value: number
}

const Deadlines: Record<string, DeadlineInfo> = {
  '2000': {
    text: 'Fast',
    mins: '10 mins',
    value: 2000,
  },
  '5000': {
    text: 'Medium',
    mins: '30 mins',
    value: 5000,
  },
  '6000': {
    text: 'Slow',
    mins: '60 mins',
    value: 6000,
  },
}
export const DeadlineDropdown: FC<Props> = ({ deadline, setDeadline }) => {
  const displayText = Deadlines[`${deadline}`]?.text || 'Fast'

  return (
    <Dropdown
      trigger={
        <Button
          corners="pill"
          color="gray3"
          size="small"
          css={{
            fontSize: 14,
            fontWeight: 500,
            minHeight: 28,
          }}
        >
          {displayText}
        </Button>
      }
      contentProps={{ sideOffset: 12, style: { width: 175 } }}
    >
      <Flex direction="column" css={{ gap: '2' }}>
        <Text style="subtitle2">Swap Deadline</Text>
        {Object.values(Deadlines).map((deadline, idx) => (
          <DropdownMenuItem
            key={idx}
            css={{ display: 'flex', justifyContent: 'space-between' }}
            onClick={() => setDeadline(deadline.value)}
          >
            <Text style="body2">{deadline.text}</Text>
            <Text style="body2" color="subtle">
              {deadline.mins}
            </Text>
          </DropdownMenuItem>
        ))}
      </Flex>
    </Dropdown>
  )
}
