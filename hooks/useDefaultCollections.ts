import useSWR from 'swr'
import useReservoirBaseApiUrl from './useReservoirBaseApiUrl'
import useSupportedNetwork from './useSupportedNetwork'
import fetcher from '../lib/utils/fetcher'
import { chainDefaultCollections } from '../lib/constants/chainDefaultCollections'
import { useMemo } from 'react'
import { buildQueryString } from '../lib/utils/params'
import { paths } from '@reservoir0x/reservoir-sdk'
import { zeroAddress } from 'viem'

const useDefaultCollections = () => {
  const { chain } = useSupportedNetwork()
  const baseApiUrl = useReservoirBaseApiUrl(chain)

  const defaultCollections = chainDefaultCollections[chain.id]

  const queryParams = useMemo(() => {
    return buildQueryString({
      contract: defaultCollections,
      displayCurrency: zeroAddress,
      limit: 6,
    })
  }, [chain])

  const { data: results } = useSWR<
    paths['/collections/v7']['get']['responses']['200']['schema']
  >(
    `${baseApiUrl}/collections/v7?${queryParams}`,
    (url: string) =>
      // We can't use a nextjs api as a proxy due to restrictions with ipfs deployments
      // Protect the api key by setting an allowist domain instead
      fetcher(url, {
        'x-api-key': process.env.NEXT_PUBLIC_RESERVOIR_API_KEY || '',
      }),
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  )

  return results?.collections
}

export default useDefaultCollections
