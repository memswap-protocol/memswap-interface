import { ReactElement, forwardRef } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { styled } from '../../styled-system/jsx'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const VIEWPORT_PADDING = 16

const ToastProvider = ToastPrimitive.Provider

const ToastViewport = styled(ToastPrimitive.Viewport, {
  base: {
    padding: VIEWPORT_PADDING,
    position: 'fixed',
    bottom: 70,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '350px',
    maxWidth: '100vw',
    zIndex: 9999999999,
    _groupHover: {
      opacity: 1,
    },
    _data_state_open: {
      animation: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
    },
    _data_state_closed: {
      animation: 'hide 100ms ease-in',
    },
    _data_swipe_move: {
      transform: 'translateX(var(--radix-toast-swipe-move-x))',
    },
    _data_swipe_cancel: {
      transform: 'translateX(0)',
      transition: 'transform 200ms ease-out',
    },
    _data_swipe_end: {
      animation: `swipeOut 100ms ease-out`,
    },
  },
})

const Toast = styled(ToastPrimitive.Root, {
  base: {
    position: 'relative',
    boxShadow: '0px 2px 16px rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 12,
    display: 'flex',
    gap: '$2',
    alignItems: 'center',
    backgroundColor: 'white',
  },
})

const ToastTitle = styled(ToastPrimitive.Title, {
  base: {
    fontSize: '14px',
    fontWeight: 500,
  },
})

const ToastDescription = styled(ToastPrimitive.Description, {
  base: {
    fontSize: '12px',
    fontWeight: 400,
  },
})

const ToastAction = styled(ToastPrimitive.Action, {
  base: {},
})

const ToastClose = styled(
  forwardRef<
    React.ElementRef<typeof ToastPrimitive.Close>,
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
  >(function ToastClose({ ...props }, ref) {
    return (
      <ToastPrimitive.Close ref={ref} toast-close="" {...props}>
        <FontAwesomeIcon icon={faX} width={10} height={10} />
      </ToastPrimitive.Close>
    )
  }),
  {
    base: {
      color: 'gray9',
      position: 'absolute',
      right: 4,
      top: 4,
      opacity: 0,
      transition: 'opacity 150ms ease-in-out',
      _groupHover: {
        opacity: 1,
      },
    },
  }
)

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
}
