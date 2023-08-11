import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import {
  connectorsForWallets,
  DisclaimerComponent,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit'
import type { AppProps } from 'next/app'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { ThemeProvider } from 'next-themes'
import Toaster from '../components/providers/ToastProvider'
import {
  coinbaseWallet,
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
    publicProvider(),
  ]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      rainbowWallet({ projectId: WALLET_CONNECT_PROJECT_ID, chains }),
      coinbaseWallet({ appName: 'MemSwap', chains }),
      walletConnectWallet({ projectId: WALLET_CONNECT_PROJECT_ID, chains }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  <Text>
    Metamask is currently not supported due to the technical limitation.
  </Text>
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="_dark"
      value={{
        dark: '_dark',
        light: 'light',
      }}
    >
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          chains={chains}
          modalSize="compact"
          appInfo={{ disclaimer: Disclaimer }}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}

export default MyApp
