import { Dispatch, FC, SetStateAction } from 'react'
import { ToggleGroupItem, ToggleGroupRoot } from '../../primitives/ToggleGroup'
import { SwapMode } from '../../../lib/types'

type ModeToggleProps = {
  swapMode: SwapMode
  setSwapMode: Dispatch<SetStateAction<SwapMode>>
}

const modes = ['Best', 'Trustless', 'Private']

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
        <ToggleGroupItem value={mode} key={mode}>
          {mode}
        </ToggleGroupItem>
      ))}
    </ToggleGroupRoot>
  )
}
