import { FC, ReactElement, useEffect } from 'react'
import { useAccount } from 'wagmi'
import posthog from 'posthog-js'

const posthogClientToken = process.env.NEXT_PUBLIC_POSTHOG_CLIENT_TOKEN

type AnalyticsProviderProps = {
  children: ReactElement
}

export const initializeAnalytics = () => {
  if (typeof window !== 'undefined' && posthogClientToken) {
    posthog.init(posthogClientToken, {
      api_host: 'https://app.posthog.com',
      disable_session_recording: true,
      mask_all_text: false,
      mask_all_element_attributes: false,
    })

    const randomNumber = Math.random()
    const samplingRate = 0.3
    if (randomNumber <= samplingRate) {
      posthog.startSessionRecording()
    }
  }
}

const AnalyticsProvider: FC<AnalyticsProviderProps> = ({ children }) => {
  const accountData = useAccount()

  useEffect(() => {
    const address = accountData?.address?.toLowerCase()
    if (address) {
      if (posthogClientToken) {
        posthog.identify(address)
      }
    }
  }, [accountData])

  return children
}

export default AnalyticsProvider
