import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  connectorsForWallets,
  DisclaimerComponent,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ThemeProvider } from 'next-themes'
import ErrorTrackingProvider from '../components/providers/ErrorTrackingProvider'
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ projectId: WALLET_CONNECT_PROJECT_ID, chains }),
      coinbaseWallet({ appName: 'MemSwap', chains }),
      walletConnectWallet({ projectId: WALLET_CONNECT_PROJECT_ID, chains }),
    ],
  },
  {
    groupName: 'Other',
    wallets: [metaMaskWallet({ chains, projectId: WALLET_CONNECT_PROJECT_ID })],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

const Disclaimer: DisclaimerComponent = ({ Text }) => (
  <Text>
    When doing ERC-20 swaps with{' '}
    <span style={{ fontWeight: 700 }}>Metamask</span>, an additional transaction
    is required due to custom approval handling. You can use a different wallet
    to avoid this.
  </Text>
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="_light"
      value={{
        dark: '_dark',
        light: 'light',
      }}
    >
      <WagmiConfig config={wagmiConfig}>
        <ErrorTrackingProvider>
          <RainbowKitProvider
            chains={chains}
            modalSize="compact"
            appInfo={{ disclaimer: Disclaimer }}
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </ErrorTrackingProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}

export default MyApp
