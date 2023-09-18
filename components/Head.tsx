import { FC } from 'react'
import NextHead from 'next/head'

type Props = {
  ogImage?: string
  title?: string
  description?: string
}

/**
 * Renders the <head> section of the HTML page, including meta tags, title, and favicon.
 * @param ogImage - The URL of the Open Graph image to be displayed in social media shares.
 * @param title - The title of the page.
 * @param description - The description of the page.
 */
export const Head: FC<Props> = ({
  ogImage = 'og-image.png',
  title = 'Memswap',
  description = 'A Decentralized “Intents-based” Protocol for Efficient and Transparent Token Swaps Leveraging the Ethereum Mempool',
}) => {
  return (
    <NextHead>
      {/* Title */}
      <title>{title}</title>

      {/* Meta tags */}
      <meta name="description" content={description} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:determiner" content="the" />
      <meta property="og:locale" content="en" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="" />
    </NextHead>
  )
}
