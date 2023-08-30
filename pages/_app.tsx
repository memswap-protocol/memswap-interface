import ErrorTrackingProvider from '../components/providers/ErrorTrackingProvider'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  connectorsForWallets,
  DisclaimerComponent,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import * as Tooltip from '@radix-ui/react-tooltip'
import type { AppProps } from 'next/app'
import {
  ChainProviderFn,
  configureChains,
  createConfig,
  WagmiConfig,
} from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import {
  AppModeProvider,
  useAppMode,
} from '../components/providers/AppModeProvider'
import { useMemo } from 'react'

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const Disclaimer: DisclaimerComponent = ({ Text }) => (
  <Text>
    When doing ERC-20 swaps with{' '}
    <span style={{ fontWeight: 700 }}>Metamask</span>, an additional transaction
    is required due to custom approval handling. You can use a different wallet
    to avoid this.
  </Text>
)

/**
 * MyApp is wrapped in a WrappedApp component which uses AppModeProvider to establish a context.
 * This context shares a single state variable `dAppModeEnabled` across the entire application.
 *
 * The `dAppModeEnabled` state determines whether the application is running in dApp mode or not.
 * - When DApp mode is enabled, we use only the public provider in the wagmi configuration.
 * - When DApp mode is disabled, the Alchemy provider is also utilized for better performance.
 *
 */
function MyApp({ Component, pageProps }: AppProps) {
  const { dAppModeEnabled } = useAppMode()

  const providers = useMemo(
    () => [
      ...(dAppModeEnabled
        ? []
        : [
            alchemyProvider({
              apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || '',
            }),
          ]),
      publicProvider(),
    ],
    [dAppModeEnabled]
  ) as ChainProviderFn<typeof mainnet | typeof goerli>[]

  const chainsConfig = useMemo(
    () => configureChains([mainnet, goerli], providers),
    [providers]
  )

  const connectors = useMemo(
    () =>
      connectorsForWallets([
        {
          groupName: 'Recommended',
          wallets: [
            injectedWallet({ chains: chainsConfig.chains }),
            rainbowWallet({
              projectId: WALLET_CONNECT_PROJECT_ID,
              chains: chainsConfig.chains,
            }),
            coinbaseWallet({ appName: 'MemSwap', chains: chainsConfig.chains }),
            walletConnectWallet({
              projectId: WALLET_CONNECT_PROJECT_ID,
              chains: chainsConfig.chains,
            }),
          ],
        },
        {
          groupName: 'Other',
          wallets: [
            metaMaskWallet({
              chains: chainsConfig.chains,
              projectId: WALLET_CONNECT_PROJECT_ID,
            }),
          ],
        },
      ]),
    [chainsConfig]
  )

  const wagmiConfig = useMemo(
    () =>
      createConfig({
        autoConnect: true,
        connectors,
        publicClient: chainsConfig.publicClient,
        webSocketPublicClient: chainsConfig.webSocketPublicClient,
      }),
    [connectors, chainsConfig]
  )

  return (
    <WagmiConfig config={wagmiConfig}>
      <ErrorTrackingProvider>
        <RainbowKitProvider
          chains={chainsConfig.chains}
          modalSize="compact"
          appInfo={{ disclaimer: Disclaimer }}
        >
          <Tooltip.Provider>
            <Component {...pageProps} />
          </Tooltip.Provider>
        </RainbowKitProvider>
      </ErrorTrackingProvider>
    </WagmiConfig>
  )
}

function WrappedApp(props: AppProps) {
  return (
    <AppModeProvider>
      <MyApp {...props} />
    </AppModeProvider>
  )
}

export default WrappedApp
