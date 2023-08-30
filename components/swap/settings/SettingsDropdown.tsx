import { Dispatch, FC, SetStateAction } from 'react'
import { Dropdown } from '../../primitives/Dropdown'
import { Button, Flex } from '../../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { SlippageInput } from './SlippageInput'
import { DeadlineInput } from './DeadlineInput'
import { Address } from 'viem'
import { MatchmakerInput } from './MatchmakerInput'
import { SwapMode } from '../../../types'

type SettingsDropdownProps = {
  swapMode: SwapMode
  slippagePercentage: string
  setSlippagePercentage: Dispatch<SetStateAction<string>>
  deadline: string
  setDeadline: Dispatch<SetStateAction<string>>
  matchmaker: Address
  setMatchmaker: Dispatch<SetStateAction<Address>>
}

export const SettingsDropdown: FC<SettingsDropdownProps> = ({
  swapMode,
  slippagePercentage,
  setSlippagePercentage,
  deadline,
  setDeadline,
  matchmaker,
  setMatchmaker,
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
        {swapMode === 'Rapid' || swapMode === 'Private' ? (
          <MatchmakerInput
            matchmaker={matchmaker}
            setMatchmaker={setMatchmaker}
          />
        ) : null}
      </Flex>
    </Dropdown>
  )
}
