import * as TabsPrimitive from '@radix-ui/react-tabs'
import { styled } from '../../styled-system/jsx'

const TabsList = styled(TabsPrimitive.List, {
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    // '--borderColor': 'colors.gray5',
    // borderBottom: '1px solid var(--borderColor)',
  },
})

const TabsTrigger = styled(TabsPrimitive.Trigger, {
  base: {
    fontWeight: '700',
    cursor: 'pointer',
    p: '2',
    color: 'gray9',
    _data_state_active: {
      color: 'black',
      // '--shadowColor': 'colors.primary10',
      // boxShadow:
      //   'inset 0 -1px 0 0 var(--shadowColor), 0 1px 0 0 var(--shadowColor)',
    },
  },
})

const TabsContent = styled(TabsPrimitive.Content, {})

export { TabsList, TabsTrigger, TabsContent }
