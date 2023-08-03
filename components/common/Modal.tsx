import { ComponentPropsWithoutRef, FC, ReactNode } from 'react'
import { Content, Overlay } from '../primitives/Dialog'
import {
  Root as DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogClose,
} from '@radix-ui/react-dialog'
import { Button } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { SystemStyleObject } from '../../styled-system/types'

type Props = {
  trigger?: ReactNode
  contentCss?: SystemStyleObject
  children: ReactNode
}

export const Modal: FC<ComponentPropsWithoutRef<typeof DialogRoot> & Props> = ({
  trigger,
  contentCss,
  children,
  ...props
}) => {
  return (
    <DialogRoot modal={true} {...props}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogPortal>
        <Overlay
          css={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
          }}
        >
          <Content css={{ padding: '5', sm: { maxWidth: 575 }, ...contentCss }}>
            <DialogClose
              asChild
              style={{ position: 'absolute', right: 32, top: 32 }}
            >
              <Button color="ghost" size="none" css={{ color: 'gray9' }}>
                <FontAwesomeIcon icon={faXmark} width={16} height={16} />
              </Button>
            </DialogClose>
            {children}
          </Content>
        </Overlay>
      </DialogPortal>
    </DialogRoot>
  )
}
