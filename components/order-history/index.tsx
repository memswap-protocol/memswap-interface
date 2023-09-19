import useSWRInfinite from 'swr/infinite'
import { request, gql } from 'graphql-request'
import { useAccount } from 'wagmi'
import { ApiIntent } from '../../lib/types'
import { Box, Flex, Text, Img, Switch } from '../primitives'
import { Grid, GridItem } from '../primitives/Grid'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { OrderStatus } from './OrderStatus'
import { Deadline } from './Deadline'
import { useMounted, useSupportedNetwork } from '../../hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { formatUnits } from 'viem'
import { formatNumber } from '../../lib/utils/numbers'
import { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import { truncateAddress } from '../../lib/utils/truncate'
import { MEMSWAP_API } from '../../lib/constants/contracts'

type IntentHistoryResponse = {
  intents: ApiIntent[]
}

const intentHistoryFetcher = (
  chainId: number,
  query: string,
  variables: { maker: string }
): Promise<IntentHistoryResponse> =>
  request(MEMSWAP_API[chainId], query, variables)

const GET_USER_INTENTS_QUERY = gql`
  query GetUserIntents($maker: String, $first: Int!, $skip: Int!) {
    intents(
      where: { maker: $maker }
      orderBy: "endTime"
      orderDirection: "desc"
      first: $first
      skip: $skip
    ) {
      id
      isBuy
      sellToken {
        id
        isNative
        isToken
        chainId
        decimals
        symbol
        name
        address
        icon
      }
      buyToken {
        id
        isNative
        isToken
        chainId
        decimals
        symbol
        name
        address
        icon
      }
      maker
      solver
      source
      feeBps
      surplusBps
      startTime
      endTime
      isPartiallyFillable
      amount
      endAmount
      startAmountBps
      expectedAmountBps
      isCancelled
      isPreValidated
      events
      amountFilled
    }
  }
`

const ITEMS_PER_PAGE = 12

const tableHeaders = ['Swap', 'Maker', 'Deadline', 'Status']

const UserOrderHistory = () => {
  const { address } = useAccount()
  const { chain } = useSupportedNetwork()
  const isMounted = useMounted()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const loadMoreObserver = useIntersectionObserver(loadMoreRef, {})
  const [showOnlyMyIntents, setShowOnlyMyIntents] = useState(false)

  // If wallet is connected, default to showing only wallet's intents
  useEffect(() => {
    setShowOnlyMyIntents(true)
  }, [address])

  const getKey = (
    pageIndex: number,
    previousPageData: IntentHistoryResponse | null
  ):
    | [number, string, { maker?: string; first: number; skip: number }]
    | null => {
    if (previousPageData && !previousPageData.intents.length) return null
    return [
      chain.id,
      GET_USER_INTENTS_QUERY,
      {
        maker: showOnlyMyIntents ? address : undefined,
        first: ITEMS_PER_PAGE,
        skip: pageIndex * ITEMS_PER_PAGE,
      },
    ]
  }

  const { data, size, setSize, error, isValidating } =
    useSWRInfinite<IntentHistoryResponse>(
      getKey,
      ([chainId, query, variables]: [number, string, { maker: string }]) =>
        intentHistoryFetcher(chainId, query, variables)
    )

  const hasNextPage =
    data && data?.[data.length - 1]?.intents?.length >= ITEMS_PER_PAGE

  useEffect(() => {
    const isVisible = !!loadMoreObserver?.isIntersecting
    if (isVisible && hasNextPage) {
      setSize(size + 1)
    }
  }, [loadMoreObserver?.isIntersecting])

  const intents = data?.flatMap((page) => page.intents) ?? []

  return (
    <Flex
      direction="column"
      css={{
        width: '100%',
        maxWidth: 1200,
        boxShadow: '0px 0px 50px 0px rgba(0, 0, 0, 0.12)',
        borderRadius: 16,
        backgroundColor: 'white',
        pt: 24,
      }}
    >
      <Flex justify="between" align="center" css={{ px: 24 }}>
        <Text style="h5">Swap History</Text>
        {isMounted && address ? (
          <Flex align="center" css={{ gap: '2' }}>
            <Text style="subtitle2">Only my history</Text>
            <Switch
              checked={showOnlyMyIntents}
              onCheckedChange={(checked) => {
                setShowOnlyMyIntents(checked)
              }}
            />
          </Flex>
        ) : null}
      </Flex>

      <Flex
        direction="column"
        css={{
          overflowX: 'auto',
          width: '100%',
        }}
      >
        <Grid
          css={{
            gridTemplateColumns:
              'minmax(300px, 2fr) repeat(3, minmax(200px, 1fr))',
            width: 'min-content',
            md: { width: '100%' },
            borderBottom: '1px solid',
            borderBottomColor: 'gray6',
          }}
        >
          {tableHeaders.map((header, idx) => (
            <GridItem key={idx}>
              <Text style="subtitle1" color="subtle">
                {header}
              </Text>
            </GridItem>
          ))}
        </Grid>

        {intents.length > 0 ? (
          <Flex direction="column">
            {intents.map((intent, idx) => {
              const amount = intent.isBuy
                ? formatUnits(intent.amount, intent?.buyToken?.decimals)
                : formatUnits(intent.amount, intent?.sellToken?.decimals)

              const endAmount = intent.isBuy
                ? formatUnits(intent.endAmount, intent?.sellToken?.decimals)
                : formatUnits(intent.endAmount, intent?.buyToken?.decimals)

              const formattedAmount = formatNumber(amount, 6)
              const formattedEndAmount = formatNumber(endAmount, 6)

              const paidAmount = intent.isBuy
                ? formattedEndAmount
                : formattedAmount
              const receivedAmount = intent.isBuy
                ? formattedAmount
                : formattedEndAmount

              return (
                <Grid
                  key={idx}
                  css={{
                    gridTemplateColumns:
                      'minmax(300px, 2fr) repeat(3, minmax(200px, 1fr))',
                    width: 'min-content',
                    md: { width: '100%' },
                    borderBottom: '1px solid',
                    borderBottomColor: 'gray6',
                    _last: { borderBottom: 'none' },
                  }}
                >
                  <GridItem>
                    <Flex align="center" css={{ gap: '2' }}>
                      <Text style="subtitle2" ellipsify>
                        {paidAmount}
                      </Text>
                      {intent.sellToken.icon ? (
                        <Img
                          src={intent.sellToken.icon}
                          alt={intent.sellToken.symbol}
                          width={16}
                          height={16}
                          css={{
                            aspectRatio: '1/1',
                            borderRadius: '50%',
                          }}
                        />
                      ) : (
                        <Text style="subtitle2">{intent.sellToken.symbol}</Text>
                      )}
                      <Box>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </Box>
                      <Text style="subtitle2" ellipsify>
                        {receivedAmount}
                      </Text>
                      {intent.buyToken.icon ? (
                        <Img
                          src={intent.buyToken.icon}
                          alt={intent.buyToken.symbol}
                          width={16}
                          height={16}
                          css={{
                            aspectRatio: '1/1',
                            borderRadius: '50%',
                          }}
                        />
                      ) : (
                        <Text style="subtitle2">{intent.buyToken.symbol}</Text>
                      )}
                    </Flex>
                  </GridItem>
                  <GridItem>
                    <Text style="subtitle2">
                      {truncateAddress(intent.maker)}
                    </Text>
                  </GridItem>
                  <GridItem>
                    <Deadline deadline={intent?.endTime} />
                  </GridItem>
                  <GridItem key={intent.id}>
                    <OrderStatus intent={intent} />
                  </GridItem>
                </Grid>
              )
            })}

            {isValidating && (
              <Flex align="center" justify="center" css={{ py: '5' }}>
                <LoadingSpinner />
              </Flex>
            )}
          </Flex>
        ) : null}
        <Box ref={loadMoreRef}></Box>
      </Flex>

      {intents.length === 0 && (
        <Flex direction="column" align="center" css={{ py: '6' }}>
          {!address && isMounted ? (
            <Text style="subtitle1" css={{ textAlign: 'center' }}>
              Connect your wallet to view order history
            </Text>
          ) : null}
          {address && data && intents.length === 0 ? (
            <Text style="subtitle1" css={{ textAlign: 'center' }}>
              No order history found
            </Text>
          ) : null}
          {!data && !error && address && isMounted ? <LoadingSpinner /> : null}
          {error ? (
            <Text style="subtitle1" css={{ textAlign: 'center' }}>
              There was an error fetching swap history
            </Text>
          ) : null}
        </Flex>
      )}
    </Flex>
  )
}

export default UserOrderHistory
