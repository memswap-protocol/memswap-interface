import { styled } from '../../styled-system/jsx'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'

const ToggleGroupRoot = styled(ToggleGroupPrimitive.Root, {
  base: {
    display: 'inline-flex',
    width: '100%',
    backgroundColor: 'gray3',
    borderRadius: 8,
    padding: '2px',
  },
})

const ToggleGroupItem = styled(ToggleGroupPrimitive.Item, {
  base: {
    all: 'unset',
    cursor: 'pointer',
    height: 40,
    width: '100%',
    display: 'flex',
    gap: '2',
    fontSize: 14,
    borderRadius: 6,
    lineHeight: 1,
    alignItems: 'center',
    justifyContent: 'center',
    '&:last-child': { borderTopRightRadius: 4, borderBottomRightRadius: 4 },
    '&[data-state=on]': {
      backgroundColor: 'white',
    },
  },
})

export { ToggleGroupRoot, ToggleGroupItem }
