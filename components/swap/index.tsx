import { useCallback, useEffect, useState } from 'react'
import {
  useBalance,
  useAccount,
  useNetwork,
  useWalletClient,
  usePublicClient,
} from 'wagmi'
import { Address, formatUnits, zeroAddress } from 'viem'
import { Button, Flex, Text, Input } from '../primitives'
import { Token, SelectTokenModal } from './SelectTokenModal'
import { useDebounce } from 'use-debounce'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { SwapModal } from './SwapModal'
import { useQuote } from '../../hooks'
import { FeeAmount } from '@uniswap/v3-sdk'
import { formatNumber } from '../../utils/numbers'
import { QuoteInfo } from './QuoteInfo'
import { chainTokens } from '../../constants/chainTokens'

const Swap = () => {
  const { address } = useAccount()
  const { chain } = useNetwork()

  const [tokenIn, setTokenIn] = useState<Token | undefined>(
    chainTokens[chain?.id || 1][0]
  )
  const [tokenOut, setTokenOut] = useState<Token | undefined>()

  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')

  const [debouncedAmountIn] = useDebounce(amountIn, 500)

  const {
    quotedAmountOut,
    isLoading: isFetchingQuote,
    isError: errorFetchingQuote,
  } = useQuote(Number(debouncedAmountIn), FeeAmount.MEDIUM, tokenIn, tokenOut)

  useEffect(() => {
    setAmountOut(quotedAmountOut ?? '')
  }, [quotedAmountOut])

  const { data: tokenInBalance } = useBalance({
    chainId: chain?.id || 1,
    address: tokenIn ? address : undefined,
    watch: tokenIn ? true : false,
    token:
      tokenIn && tokenIn?.address !== zeroAddress
        ? (tokenIn?.address as Address)
        : undefined,
  })

  const { data: tokenOutBalance } = useBalance({
    chainId: chain?.id || 1,
    address: tokenOut ? address : undefined,
    watch: tokenOut ? true : false,
    token:
      tokenOut && tokenOut?.address !== zeroAddress
        ? (tokenOut?.address as Address)
        : undefined,
  })

  const switchTokens = useCallback(() => {
    const currentTokenIn = tokenIn
    const currentTokenOut = tokenOut

    setTokenIn(currentTokenOut)
    setTokenOut(currentTokenIn)
  }, [tokenOut, tokenIn])

  return (
    <Flex
      direction="column"
      css={{
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0px 0px 50px 0px #0000001F',
        borderRadius: 8,
        p: '4',
        gap: '3',
        maxWidth: 600,
      }}
    >
      <Text style="h5" css={{ mb: '3' }}>
        Swap
      </Text>
      <Flex
        direction="column"
        css={{
          position: 'relative',
          backgroundColor: 'gray2',
          borderRadius: 8,
          p: '5',
        }}
      >
        <Text style="subtitle2" color="subtle">
          Pay
        </Text>
        <Flex
          align="start"
          justify="between"
          css={{
            gap: '4',
          }}
        >
          <Flex direction="column" css={{}}>
            <Input
              type="number"
              placeholder="0"
              size="large"
              css={{
                backgroundColor: 'transaparent',
                borderRadius: 0,
                p: 0,
                _focus: { boxShadow: 'none' },
              }}
              value={amountIn}
              onChange={(e) => {
                if (e.target.value) {
                  setAmountIn(Math.abs(Number(e.target.value)).toString())
                } else {
                  setAmountIn('')
                }
              }}
            />
          </Flex>
          <Flex direction="column" align="end" css={{ gap: '2' }}>
            <SelectTokenModal token={tokenIn} setToken={setTokenIn} />
            {tokenInBalance ? (
              <Text style="subtitle2" color="subtle" ellipsify>
                Balance:{' '}
                {formatNumber(
                  formatUnits(tokenInBalance?.value, tokenInBalance?.decimals),
                  8
                )}
              </Text>
            ) : null}
          </Flex>
        </Flex>
        <Button
          size="xs"
          color="white"
          corners="circle"
          css={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -24,
            margin: 'auto',
            maxWidth: 'max-content',
            height: 40,
            width: 40,
            zIndex: 2,
            color: 'gray9',
          }}
          onClick={switchTokens}
        >
          <FontAwesomeIcon icon={faChevronDown} />
        </Button>
      </Flex>
      <Flex
        direction="column"
        css={{
          position: 'relative',
          backgroundColor: 'gray2',
          borderRadius: 8,
          p: '5',
        }}
      >
        <Text style="subtitle2" color="subtle">
          Receive
        </Text>
        <Flex align="start" justify="between" css={{ gap: '4' }}>
          <Input
            type="text"
            disabled={true}
            placeholder="0"
            size="large"
            css={{
              backgroundColor: 'transaparent',
              p: 0,
              borderRadius: 0,
              _focus: { boxShadow: 'none' },
            }}
            // value={amountOut.replace(',', '')}
            value={formatNumber(amountOut, 8).replace(',', '')}
            // value={formatNumber(quotedAmountOut, 8).replace(',', '')}
            // onChange={(e) => {
            //   if (e.target.value) {
            //     setAmountOut(e.target.value)
            //   } else {
            //     setAmountOut('')
            //   }
            // }}
          />
          <Flex direction="column" align="end" css={{ gap: '2' }}>
            <SelectTokenModal token={tokenOut} setToken={setTokenOut} />
            {tokenOutBalance ? (
              <Text style="subtitle2" color="subtle" ellipsify>
                Balance:{' '}
                {formatNumber(
                  formatUnits(
                    tokenOutBalance?.value,
                    tokenOutBalance?.decimals
                  ),
                  8
                )}
              </Text>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
      <QuoteInfo
        errorFetchingQuote={errorFetchingQuote}
        isFetchingQuote={isFetchingQuote}
        quotedAmountOut={quotedAmountOut}
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
        amountOut={amountOut}
      />
      <SwapModal
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
        amountOut={amountOut}
        tokenInBalance={tokenInBalance}
        isFetchingQuote={isFetchingQuote}
        errorFetchingQuote={errorFetchingQuote}
      />
    </Flex>
  )
}
export default Swap
