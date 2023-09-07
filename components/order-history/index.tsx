import useSWR from 'swr'
import { request, gql } from 'graphql-request'
import { useAccount } from 'wagmi'
import { ApiIntent } from '../../lib/types'
import { Flex, Text } from '../primitives'
import { Grid, GridItem } from '../primitives/Grid'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { OrderStatus } from './OrderStatus'
import { Deadline } from './Deadline'
import { useMounted } from '../../hooks'

type IntentHistoryResponse = {
  intents: ApiIntent[]
}

const intentHistoryFetcher = (
  query: string,
  variables: { maker: string }
): Promise<IntentHistoryResponse> =>
  request('https://memswap-backend-goerli.up.railway.app', query, variables)

const GET_USER_INTENTS_QUERY = gql`
  query GetUserIntents($maker: String!) {
    intents(
      where: { maker: $maker }
      orderBy: "deadline"
      orderDirection: "desc"
    ) {
      id
      tokenIn
      tokenOut
      maker
      matchmaker
      deadline
      isPartiallyFillable
      amountIn
      endAmountOut
      events
      isCancelled
      isValidated
      amountFilled
    }
  }
`

const tableHeaders = ['Swap', 'Deadline', 'Min Amount', 'Status']

const UserOrderHistory = () => {
  const { address } = useAccount()
  const isMounted = useMounted()

  const { data, error } = useSWR<IntentHistoryResponse>(
    address ? [GET_USER_INTENTS_QUERY, { maker: address }] : null,
    ([query, variables]: [string, { maker: string }]) =>
      intentHistoryFetcher(query, variables)
  )

  const intents = data?.intents ?? []

  return (
    <Flex
      direction="column"
      css={{
        width: '100%',
        maxWidth: '940px',
        boxShadow: '0px 0px 50px 0px rgba(0, 0, 0, 0.12)',
        borderRadius: 16,
        backgroundColor: 'white',
        pt: 24,
      }}
    >
      <Text style="h5" css={{ px: 24 }}>
        Swap History
      </Text>

      <Flex direction="column" css={{ overflowX: 'auto', width: '100%' }}>
        <Grid
          css={{
            gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))',
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

        {intents.length > 0
          ? intents.map((intent, idx) => (
              <Grid
                key={idx}
                css={{
                  gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))',
                  width: 'min-content',
                  md: { width: '100%' },
                  borderBottom: '1px solid',
                  borderBottomColor: 'gray6',
                }}
              >
                <GridItem></GridItem>

                <GridItem>
                  <Deadline deadline={intent.deadline} />
                </GridItem>
                <GridItem></GridItem>
                <GridItem key={intent.id}>
                  <OrderStatus intent={intent} />
                </GridItem>
              </Grid>
            ))
          : null}
      </Flex>

      {intents.length === 0 && (
        <Flex direction="column" align="center" css={{ py: '6' }}>
          {!address && isMounted ? (
            <Text style="subtitle1" css={{ textAlign: 'center' }}>
              Connect your wallet to view order history
            </Text>
          ) : null}
          {data && intents.length === 0 ? (
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
