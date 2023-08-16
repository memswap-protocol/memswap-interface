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
    all: 'unset',
    width: '100%',
    px: 16,
    py: 12,
    borderRadius: 8,
    fontFamily: 'body',
    fontSize: 16,
    color: 'gray12',
    backgroundColor: 'gray3',
    _placeholder: {
      color: 'gray10',
    },
    '--focusColor': 'colors.primary11',
    _focus: {
      boxShadow: '0 0 0 2px var(--focusColor)',
    },
    _disabled: {
      backgroundColor: 'gray2',
      color: 'gray9',
    },
    _spinButtons: {
      WebkitAppearance: 'none',
    },
  },

  variants: {
    size: {
      large: {
        fontSize: 32,
      },
    },
    ellipsify: {
      true: {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      },
    },
  },
})

const Input = forwardRef<
  ElementRef<typeof StyledInput>,
  ComponentPropsWithoutRef<typeof StyledInput> & {
    icon?: ReactNode
    iconPosition?: 'left' | 'right'
    containerCss?: SystemStyleObject
  }
>(({ children, icon, iconPosition, containerCss, ...props }, forwardedRef) => (
  <Flex css={{ ...containerCss, position: 'relative' }}>
    {icon && (
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: iconPosition === 'right' ? 'unset' : 16,
          right: iconPosition === 'right' ? 16 : 'unset',
        }}
      >
        {icon}
      </div>
    )}
    <StyledInput
      paddingLeft={icon && iconPosition !== 'right' ? 42 : 16}
      paddingRight={icon && iconPosition === 'right' ? 42 : 16}
      ref={forwardedRef}
      {...props}
    />
  </Flex>
))

Input.displayName = 'Input'

export default Input
