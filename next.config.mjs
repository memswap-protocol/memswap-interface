import { withSentryConfig } from '@sentry/nextjs'

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: 'javascript-nextjs',
  silent: true,
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  sentry: {
    hideSourceMaps: false,
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  },
  images: {
    domains: ['assets.coingecko.com'],
  },
}

// module.exports = nextConfig

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions)
