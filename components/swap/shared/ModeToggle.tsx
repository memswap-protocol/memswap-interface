import { Dispatch, FC, SetStateAction } from 'react'
import { ToggleGroupItem, ToggleGroupRoot } from '../../primitives/ToggleGroup'
import { Box, Text } from '../../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBolt, faHammer, faLock } from '@fortawesome/free-solid-svg-icons'
import { SwapMode } from '../../../lib/types'
import Tooltip from '../../primitives/Tooltip'

type ModeToggleProps = {
  swapMode: SwapMode
  setSwapMode: Dispatch<SetStateAction<SwapMode>>
}

const modes = [
  {
    value: 'Rapid',
    icon: faBolt,
    tooltip: 'Insanely fast swap at the best price by leveraging a Matchmaker',
  },
  {
    value: 'Dutch',
    icon: faHammer,
    tooltip:
      'Decentralized Solvers compete to fill your order as the price slowly decreases',
  },
  {
    value: 'Private',
    icon: faLock,
    tooltip:
      'Send your order to a single reputable solver to avoid front-running',
  },
]

export const ModeToggle: FC<ModeToggleProps> = ({ swapMode, setSwapMode }) => {
  return (
    <ToggleGroupRoot
      type="single"
      defaultValue="rapid"
      value={swapMode}
      onValueChange={(value: SwapMode) => {
        if (value) setSwapMode(value)
      }}
    >
      {modes.map((mode) => (
        <Tooltip
          key={mode.value}
          content={
            <Text
              style="subtitle3"
              color="subtle"
              css={{ maxWidth: 220, display: 'inline-block' }}
            >
              {mode.tooltip}
            </Text>
          }
          side="top"
        >
          <Box css={{ width: '100%' }}>
            <ToggleGroupItem value={mode.value}>
              <>
                <Box css={{ color: 'gray9' }}>
                  <FontAwesomeIcon icon={mode.icon} />
                </Box>
                {mode.value}
              </>
            </ToggleGroupItem>
          </Box>
        </Tooltip>
      ))}
    </ToggleGroupRoot>
  )
}
