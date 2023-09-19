import useSWRInfinite from 'swr/infinite'
import { request, gql } from 'graphql-request'
import { useAccount } from 'wagmi'
import { ApiIntent } from '../../lib/types'
import { Box, Flex, Text, Img, Switch, Anchor } from '../primitives'
import { Grid, GridItem } from '../primitives/Grid'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { OrderStatus } from './OrderStatus'
import { Deadline } from './Deadline'
import { useMounted, useSupportedNetwork } from '../../hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons'
import { formatUnits } from 'viem'
import { formatNumber } from '../../lib/utils/numbers'
import { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'
import { truncateAddress } from '../../lib/utils/truncate'
import { MEMSWAP_API, MEMSWAP_WETH } from '../../lib/constants/contracts'

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

              const sellTokenLogo =
                intent?.sellToken.address.toLowerCase() ===
                MEMSWAP_WETH[chain.id].toLowerCase()
                  ? 'data:image/png;base64,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'
                  : intent?.sellToken?.icon

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
                      {sellTokenLogo ? (
                        <Img
                          src={sellTokenLogo}
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
                        <FontAwesomeIcon icon={faArrowRight} width={12} />
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
                      {intent?.isPreValidated && intent?.events[1] ? (
                        <Anchor
                          target="_blank"
                          href={`${chain.blockExplorers?.default?.url}/tx/${intent?.events[1]}`}
                        >
                          <Box css={{ color: 'gray9' }}>
                            <FontAwesomeIcon
                              icon={faArrowUpRightFromSquare}
                              width={12}
                            />
                          </Box>
                        </Anchor>
                      ) : null}
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
