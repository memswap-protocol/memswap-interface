import { styled } from '../../styled-system/jsx'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
  useState,
} from 'react'

const Overlay = styled(DialogPrimitive.Overlay, {
  base: {
    position: 'fixed',
    inset: 0,
  },
})

const Content = styled(DialogPrimitive.Content, {
  base: {
    backgroundColor: 'white',
    borderRadius: 16,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
    minWidth: '90vw',
    maxWidth: '98vw',
    sm: {
      minWidth: '400px',
      maxWidth: '532px',
    },
    maxHeight: '85vh',
    overflowY: 'auto',
    _focus: { outline: 'none' },
  },
})

const AnimatedContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ children, ...props }, forwardedRef) => (
  <Content forceMount asChild {...props}>
    <motion.div
      ref={forwardedRef}
      transition={{ type: 'spring', duration: 0.5 }}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
    >
      {children}
    </motion.div>
  </Content>
))

AnimatedContent.displayName = 'AnimatedContent'

type Props = {
  trigger: ReactNode
  portalProps?: DialogPrimitive.PortalProps
}

const Dialog = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & Props
>(({ children, trigger, portalProps, ...props }, forwardedRef) => {
  const [open, setOpen] = useState(false)

  return (
    <DialogPrimitive.Root onOpenChange={setOpen} open={open}>
      <DialogPrimitive.DialogTrigger asChild>
        {trigger}
      </DialogPrimitive.DialogTrigger>
      {open && (
        <DialogPrimitive.DialogPortal {...portalProps}>
          <Content ref={forwardedRef} {...props}>
            {children}
          </Content>
        </DialogPrimitive.DialogPortal>
      )}
    </DialogPrimitive.Root>
  )
})

Dialog.displayName = 'Dialog'

export { Dialog, Content, AnimatedContent, Overlay }
