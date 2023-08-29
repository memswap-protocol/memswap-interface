import { FC } from 'react'
import { ToggleGroupItem, ToggleGroupRoot } from '../primitives/ToggleGroup'

type ModeToggleProps = {}

export const ModeToggle: FC<ModeToggleProps> = ({}) => {
  return (
    <ToggleGroupRoot type="single" defaultValue="rapid">
      <ToggleGroupItem value="rapid">Rapid</ToggleGroupItem>
      <ToggleGroupItem value="dutch">Dutch</ToggleGroupItem>
      <ToggleGroupItem value="private">Private</ToggleGroupItem>
    </ToggleGroupRoot>
  )
}
