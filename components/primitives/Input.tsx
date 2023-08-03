import { styled } from '../../styled-system/jsx'
import Flex from './Flex'
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from 'react'
import { SystemStyleObject } from '../../styled-system/types'

const StyledInput = styled('input', {
  base: {
    width: '100%',
    px: 16,
    py: 12,
    borderRadius: 8,
    fontFamily: 'body',
    fontSize: 16,
    color: 'gray12',
    backgroundColor: 'gray3',
    _spinButtons: {
      WebkitAppearance: 'none',
    },
  },

  variants: {
    color: {
      error: {
        // $$errorColor: '$colors$red7',
        // boxShadow: '0 0 0 2px $$errorColor',
      },
    },
  },
})

const Input = forwardRef<
  ElementRef<typeof StyledInput>,
  ComponentPropsWithoutRef<typeof StyledInput> & {
    icon?: ReactNode
    containerCss?: SystemStyleObject
  }
>(({ children, icon, containerCss, ...props }, forwardedRef) => (
  <Flex css={{ ...containerCss, position: 'relative' }}>
    {icon && (
      <div style={{ position: 'absolute', top: 16, left: 16 }}>{icon}</div>
    )}
    <StyledInput css={{ pl: icon ? 48 : 16 }} ref={forwardedRef} {...props} />
  </Flex>
))

Input.displayName = 'Input'

export default Input
