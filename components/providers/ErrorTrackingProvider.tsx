import * as Sentry from '@sentry/nextjs'

import { FC, ReactElement, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useAppMode } from './AppModeProvider'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

type ErrorTrackingProviderProps = {
  children: ReactElement
}

const ErrorTrackingProvider: FC<ErrorTrackingProviderProps> = ({
  children,
}) => {
  const { address } = useAccount()
  const { dAppModeEnabled } = useAppMode()

  useEffect(() => {
    if (!SENTRY_DSN || dAppModeEnabled) {
      return
    }

    if (address) {
      Sentry.setUser({ id: address })
    } else {
      Sentry.setUser(null)
    }
  }, [address])

  return children
}

export default ErrorTrackingProvider
