import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Button } from '../primitives'
import { SystemStyleObject } from '../../styled-system/types'
import { FC, ReactNode } from 'react'
import { useMounted } from '../../hooks'

type ConnectWalletButtonProps = {
  children: ReactNode
  css?: SystemStyleObject
}

export const ConnectWalletButton: FC<ConnectWalletButtonProps> = ({
  children,
  css,
}) => {
  const isMounted = useMounted()
  const { isDisconnected, isConnecting } = useAccount()

  const { openConnectModal } = useConnectModal()

  if (isDisconnected || isConnecting || !isMounted)
    return (
      <Button
        color="primary"
        css={{ justifyContent: 'center', ...css }}
        onClick={openConnectModal}
      >
        {children}
      </Button>
    )
  return (
    <ConnectButton
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'full',
      }}
      chainStatus={{
        smallScreen: 'icon',
        largeScreen: 'icon',
      }}
      showBalance={false}
    />
  )
}
