import { Dispatch, FC, SetStateAction } from 'react'
import { Dropdown } from '../../primitives/Dropdown'
import { Anchor, Box, Button, Flex, Text } from '../../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare,
  faGear,
} from '@fortawesome/free-solid-svg-icons'
import { SlippageInput } from './SlippageInput'
import { DeadlineInput } from './DeadlineInput'
import { SwapMode } from '../../../lib/types'
import { ModeToggle } from './ModeToggle'

type SettingsDropdownProps = {
  slippagePercentage: string
  setSlippagePercentage: Dispatch<SetStateAction<string>>
  deadline: string
  setDeadline: Dispatch<SetStateAction<string>>
  swapMode: SwapMode
  setSwapMode: Dispatch<SetStateAction<SwapMode>>
}

export const SettingsDropdown: FC<SettingsDropdownProps> = ({
  slippagePercentage,
  setSlippagePercentage,
  deadline,
  setDeadline,
  swapMode,
  setSwapMode,
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
        <Anchor href="https://docs.memswap.xyz/" target="_blank" color="gray">
          <Flex align="center" css={{ gap: '2', whiteSpace: 'nowrap' }}>
            <Text style="subtitle2">Swap Mode</Text>
            <Box
              css={{ color: 'primary9', _groupHover: { color: 'primary10' } }}
            >
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Box>
          </Flex>
        </Anchor>
        <ModeToggle swapMode={swapMode} setSwapMode={setSwapMode} />
        {swapMode === 'Private' ? (
          <Text style="body3" color="subtle">
            Requires a wallet that supports eth_signTransaction. Eg. Coinbase
            Wallet
          </Text>
        ) : null}
      </Flex>
    </Dropdown>
  )
}
