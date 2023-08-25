import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Fuse from 'fuse.js'
import { Address, isAddress } from 'viem'
import { Token } from '../types'

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

    if (query.from) {
      const foundTokenIn = fuse.search(query.from as Address)[0]?.item
      if (foundTokenIn) setTokenIn(foundTokenIn)
    }

    if (query.to) {
      const foundTokenOut = fuse.search(query.to as Address)?.[0]?.item
      if (foundTokenOut) setTokenOut(foundTokenOut)
    }

    if (query.referrer && isAddress(query.referrer as string))
      setReferrer(query.referrer as Address)
  }, [tokens])

  return { tokenIn, tokenOut, referrer }
}

export default useDeepLinkParams
