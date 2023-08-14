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
import {
  coinbaseWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { Flex } from '../components/primitives'

const WALLET_CONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ''

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, goerli],
  [
    // alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || '' }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'MemSwap',
  projectId: WALLET_CONNECT_PROJECT_ID,
  chains,
})

// const connectors = connectorsForWallets([
//   {
//     groupName: 'Popular',
//     wallets: [
//       rainbowWallet({ projectId: WALLET_CONNECT_PROJECT_ID, chains }),
//       coinbaseWallet({ appName: 'MemSwap', chains }),
//       walletConnectWallet({ projectId: WALLET_CONNECT_PROJECT_ID, chains }),
//     ],
//   },
// ])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

// @TODO: remove?
// const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
//   <Text>
//     <span style={{ fontWeight: 700 }}>Metamask</span> is currently not supported
//     due to a technical limitation.
//   </Text>
// )

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
        <RainbowKitProvider chains={chains} modalSize="compact">
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}

export default MyApp
