import { Dispatch, FC, SetStateAction } from 'react'
import { Dropdown } from '../../primitives/Dropdown'
import { Button, Flex } from '../../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { SlippageInput } from './SlippageInput'
import { DeadlineInput } from './DeadlineInput'
import { SwapMode } from '../../../lib/types'

type SettingsDropdownProps = {
  slippagePercentage: string
  setSlippagePercentage: Dispatch<SetStateAction<string>>
  deadline: string
  setDeadline: Dispatch<SetStateAction<string>>
}

export const SettingsDropdown: FC<SettingsDropdownProps> = ({
  slippagePercentage,
  setSlippagePercentage,
  deadline,
  setDeadline,
}) => {
  return (
    <Dropdown
      trigger={
        <Button
          corners="circle"
          color="gray3"
          size="small"
          css={{ color: 'gray9' }}
        >
          <FontAwesomeIcon icon={faGear} />
        </Button>
      }
      contentProps={{ sideOffset: 12, style: { maxWidth: 248 }, align: 'end' }}
    >
      <Flex direction="column" css={{ gap: '2' }}>
        <SlippageInput
          slippagePercentage={slippagePercentage}
          setSlippagePercentage={setSlippagePercentage}
        />
        <DeadlineInput deadline={deadline} setDeadline={setDeadline} />
      </Flex>
    </Dropdown>
  )
}
