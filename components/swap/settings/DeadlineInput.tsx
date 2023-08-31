import { Dispatch, FC, SetStateAction } from 'react'
import { Text, Flex, Input } from '../../primitives'

type DeadlineInputProps = {
  deadline: string
  setDeadline: Dispatch<SetStateAction<string>>
}

export const DeadlineInput: FC<DeadlineInputProps> = ({
  deadline,
  setDeadline,
}) => {
  return (
    <Flex direction="column" css={{ gap: '2' }}>
      <Text style="subtitle2">Swap Deadline</Text>
      <Input
        value={deadline}
        placeholder="5"
        onChange={(e) => {
          const inputValue = e.target.value
          const regex = /^[0-9]*[.,]?[0-9]*$/

          if (
            (regex.test(inputValue) && Number(inputValue) >= 0) ||
            inputValue === ''
          ) {
            setDeadline(inputValue)
          }
        }}
        onBlur={() => {
          if (deadline === '') {
            setDeadline('5')
          }
        }}
        icon={<>mins</>}
        iconPosition="right"
      />
    </Flex>
  )
}
