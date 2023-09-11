import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import { Text, Button, Flex, Input, Box, Img } from '../../primitives'
import { Modal } from '../../common/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { LoadingSpinner } from '../../common/LoadingSpinner'
import { Collection, Token } from '../../../lib/types'
import { useDebounce } from 'use-debounce'
import { useReservoirBaseApiUrl, useSupportedNetwork } from '../../../hooks'
import useSWR from 'swr'
import fetcher from '../../../lib/utils/fetcher'
import { buildQueryString } from '../../../lib/utils/params'
import { isAddress } from 'viem'
import { formatNumber } from '../../../lib/utils/numbers'
import { paths } from '@reservoir0x/reservoir-sdk'
import useDefaultCollections from '../../../hooks/useDefaultCollections'

type SelectCollectionModalProps = {
  tokenIn?: Token
  collection?: Collection
  setCollection: Dispatch<SetStateAction<Collection | undefined>>
}

export const SelectCollectionModal: FC<SelectCollectionModalProps> = ({
  tokenIn,
  collection,
  setCollection,
}) => {
  const { chain } = useSupportedNetwork()
  const baseApiUrl = useReservoirBaseApiUrl(chain)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [debouncedInput] = useDebounce(input, 500)
  const defaultCollections = useDefaultCollections()

  const queryParams = useMemo(() => {
    if (isAddress(debouncedInput)) {
      return buildQueryString({
        id: debouncedInput,
        displayCurrency: tokenIn?.address,
        limit: 8,
      })
    } else {
      return buildQueryString({
        name: debouncedInput,
        displayCurrency: tokenIn?.address,
        limit: 6,
      })
    }
  }, [debouncedInput, tokenIn?.address])

  const { data: results, isLoading } = useSWR<
    paths['/collections/v7']['get']['responses']['200']['schema']
  >(
    debouncedInput ? `${baseApiUrl}/collections/v7?${queryParams}` : null,
    (url: string) =>
      // We can't use a nextjs api as a proxy due to restrictions with ipfs deployments
      // Protect the api key by setting an allowist domain instead
      fetcher(url, {
        'x-api-key': process.env.NEXT_PUBLIC_RESERVOIR_API_KEY || '',
      })
  )

  const collectionsToDisplay =
    results?.collections || (debouncedInput === '' ? defaultCollections : [])

  return (
    <Modal
      trigger={
        <Button
          color={collection ? 'white' : 'black'}
          size="small"
          corners="pill"
          css={{
            justifyContent: 'space-between',
            flexShrink: 0,
            width: 'max-content',
            maxWidth: 200,
            lineHeight: '20px',
          }}
        >
          {collection ? (
            <>
              <Img
                src={collection?.image || ''}
                alt={collection?.name || 'Collection Name'}
                width={24}
                height={24}
                css={{
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                }}
              />{' '}
              <Text ellipsify>{collection?.name}</Text>
            </>
          ) : (
            <Text css={{ color: 'white' }} ellipsify>
              Select collection
            </Text>
          )}
          <FontAwesomeIcon icon={faChevronDown} width={16} height={16} />
        </Button>
      }
      open={open}
      onOpenChange={(openChange) => {
        setOpen(openChange)
      }}
      contentCss={{ overflow: 'hidden' }}
    >
      <Flex
        direction="column"
        css={{
          width: '100%',
          height: '100%',
          gap: '3',
          sm: {
            width: 336,
          },
        }}
      >
        <Text style="h5">Select a collection</Text>
        <Input
          placeholder="Search collection name or address"
          icon={
            <Box css={{ color: 'gray9' }}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Box>
          }
          css={{ mb: '1' }}
          onChange={(e) => setInput(e.target.value)}
        />

        <Flex direction="column" css={{ height: 400 }}>
          {collectionsToDisplay && collectionsToDisplay?.length > 0 ? (
            <Flex direction="column" css={{ gap: '2' }}>
              <Flex justify="between">
                <Text style="subtitle2" color="subtle">
                  Collection
                </Text>
                <Text style="subtitle2" color="subtle">
                  Floor
                </Text>
              </Flex>

              <Flex
                direction="column"
                css={{ overflow: 'scroll', height: 400 }}
              >
                {collectionsToDisplay?.map(
                  (result: Collection, idx: number) => {
                    const isSelected = result?.id === collection?.id

                    return (
                      <Flex
                        key={idx}
                        justify="between"
                        align="center"
                        css={{
                          cursor: 'pointer',
                          borderRadius: 16,
                          p: '1',
                          px: '2',
                          gap: '3',
                          backgroundColor: isSelected ? 'gray5' : 'transparent',
                          _hover: { backgroundColor: 'gray3' },
                        }}
                        onClick={() => {
                          setCollection(result)
                          setOpen(false)
                        }}
                      >
                        <Flex
                          align="center"
                          css={{ gap: '2', overflow: 'hidden' }}
                        >
                          <Img
                            src={result?.image || ''}
                            alt={result?.name || 'Collection Image'}
                            css={{
                              borderRadius: 8,
                              aspectRatio: '1/1',
                            }}
                            width={40}
                            height={40}
                          />
                          <Flex direction="column" css={{ overflow: 'hidden' }}>
                            <Text style="h6" ellipsify>
                              {result?.name}
                            </Text>
                            <Text style="subtitle2" color="subtle">
                              {formatNumber(result?.tokenCount)} items
                            </Text>
                          </Flex>
                        </Flex>

                        <Text
                          style="subtitle2"
                          color="subtle"
                          css={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {result?.floorAsk?.price?.amount?.decimal}{' '}
                          {result?.floorAsk?.price?.currency?.symbol}
                        </Text>
                      </Flex>
                    )
                  }
                )}
              </Flex>
            </Flex>
          ) : isLoading ? (
            <Flex direction="column" align="center" css={{ py: '6' }}>
              <LoadingSpinner />
            </Flex>
          ) : (
            <Flex direction="column" align="center" css={{ py: '6' }}>
              <Text style="subtitle1">No results found</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Modal>
  )
}
