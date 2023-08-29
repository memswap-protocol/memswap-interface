import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { styled } from '../../styled-system/jsx'

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
    fontSize: 14,
    lineHeight: 1,
    alignItems: 'center',
    justifyContent: 'center',
    '&:first-child': {
      marginLeft: 0,
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    '&:last-child': { borderTopRightRadius: 4, borderBottomRightRadius: 4 },
    // '&:hover': { backgroundColor: violet.violet3 },
    '&[data-state=on]': {
      backgroundColor: 'white',
    },
    '&:focus': { position: 'relative' },
  },
})

export { ToggleGroupRoot, ToggleGroupItem }
