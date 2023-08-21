import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Fuse from 'fuse.js'
import { Token } from '../components/swap/SelectTokenModal'
import { Address, isAddress } from 'viem'

const fuseDeepLinkOptions = {
  keys: ['address', 'symbol'],
  threshold: 0.0,
}

function useDeepLinkParams(tokens: Token[]) {
  const router = useRouter()

  const [tokenIn, setTokenIn] = useState<Token | undefined>()
  const [tokenOut, setTokenOut] = useState<Token | undefined>()
  const [referrer, setReferrer] = useState<Address | undefined>()

  const fuse = new Fuse(tokens || [], fuseDeepLinkOptions)

  useEffect(() => {
    const { query } = router

    if (query.tokenIn) {
      const foundTokenIn = fuse.search(query.tokenIn as Address)[0]?.item
      if (foundTokenIn) setTokenIn(foundTokenIn)
    }

    if (query.tokenOut) {
      const foundTokenOut = fuse.search(query.tokenOut as Address)?.[0]?.item
      if (foundTokenOut) setTokenOut(foundTokenOut)
    }

    console.log(query.referrer)
    if (query.referrer && isAddress(query.referrer as string))
      console.log('set referrer')
    setReferrer(query.referrer as Address)
  }, [router.query, tokens])

  return { tokenIn, tokenOut, referrer }
}

export default useDeepLinkParams
