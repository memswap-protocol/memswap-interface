import { FC } from 'react'
import { Dropdown, DropdownMenuItem } from '../primitives/Dropdown'
import { Button, Text } from '../primitives'

type Props = {}

export const SlippageDropdown: FC<Props> = ({}) => {
  return (
    <Dropdown trigger={<Button>0.5% slippage</Button>}>
      <Text>Max Slippage</Text>
      <DropdownMenuItem></DropdownMenuItem>
    </Dropdown>
  )
}
