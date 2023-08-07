import { styled } from '../../styled-system/jsx'
import * as DialogPrimitive from '@radix-ui/react-dialog'
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
    backgroundColor: 'primary12',
    borderRadius: 8,
    position: 'fixed',
    top: '12.5%',
    left: '50%',
    transform: 'translateX(-50%)',
    minWidth: '90vw',
    sm: {
      minWidth: 'unset',
    },
    maxWidth: '90vw',
    maxHeight: '85vh',
    overflowY: 'auto',
    _focus: { outline: 'none' },
    zIndex: 5000,
  },
})

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

export { Dialog, Content, Overlay }
