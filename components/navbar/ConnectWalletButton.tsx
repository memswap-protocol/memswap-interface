import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Button } from '../primitives'
import { SystemStyleObject } from '../../styled-system/types'
import { FC, ReactNode } from 'react'

type Props = {
  children: ReactNode
  css?: SystemStyleObject
}

export const ConnectWalletButton: FC<Props> = ({ children, css }) => {
  const { isDisconnected } = useAccount()

  const { openConnectModal } = useConnectModal()

  if (isDisconnected)
    return (
      <Button
        color="primary"
        css={{ justifyContent: 'center', ...css }}
        onClick={openConnectModal}
      >
        {children}
      </Button>
    )
  return <ConnectButton />
}