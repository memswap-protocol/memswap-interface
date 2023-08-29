import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
  useState,
} from 'react'
import { styled } from '../../styled-system/jsx'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { AnimatePresence, motion } from 'framer-motion'

const DropdownMenuContent = styled(DropdownMenuPrimitive.DropdownMenuContent, {
  base: {
    mx: '4',
    p: '3',
    borderRadius: 8,
    zIndex: 5,
    background: 'white',
    boxShadow: '0px 0px 50px 0px #0000001F',
  },
})

const AnimatedDropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuContent>,
  ComponentPropsWithoutRef<typeof DropdownMenuContent>
>(({ children, ...props }, forwardedRef) => (
  <DropdownMenuContent asChild forceMount {...props}>
    <motion.div
      ref={forwardedRef}
      initial={{ scale: 0.9, opacity: 0, y: -20 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
        transition: { mass: 0.05, type: 'spring', duration: 0.05 },
      }}
      exit={{
        y: -20,
        scale: 0.9,
        opacity: 0,
        transition: { duration: 0.05 },
      }}
    >
      {children}
    </motion.div>
  </DropdownMenuContent>
))

AnimatedDropdownMenuContent.displayName = 'AnimatedDropdownMenuContent'

const DropdownMenuItem = styled(DropdownMenuPrimitive.DropdownMenuItem, {
  base: {
    fontSize: 16,
    color: 'gray12',
    backgroundColor: 'gray2',
    p: '3',
    borderRadius: 8,
    outline: 'none',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'gray5',
    },
    '&:focus': {
      backgroundColor: 'gray5',
    },
  },
})

type Props = {
  trigger: ReactNode
  contentProps?: DropdownMenuPrimitive.DropdownMenuContentProps
}

const Dropdown = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Root>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root> & Props
>(({ children, trigger, contentProps, ...props }, forwardedRef) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenuPrimitive.Root {...props} open={open} onOpenChange={setOpen}>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>
      <AnimatePresence>
        {open && (
          <AnimatedDropdownMenuContent ref={forwardedRef} {...contentProps}>
            {children}
          </AnimatedDropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenuPrimitive.Root>
  )
})

Dropdown.displayName = 'Dropdown'

export { Dropdown, DropdownMenuContent, DropdownMenuItem }
