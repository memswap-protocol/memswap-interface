import { useCallback, useState } from 'react'
import { Button, Flex, Text } from '../primitives'
import { Token, SelectTokenModal } from './SelectTokenModal'
import Input from '../primitives/Input'
import {
  usePrepareContractWrite,
  useContractWrite,
  useBalance,
  useAccount,
} from 'wagmi'
import MEMSWAP_ABI from '../../constants/memswapABI'
import { Address, zeroAddress } from 'viem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { TradeType } from '@uniswap/sdk-core'
import { Trade as V2TradeSDK } from '@uniswap/v2-sdk'
import { Trade as V3TradeSDK } from '@uniswap/v3-sdk'
import {
  MixedRouteTrade,
  MixedRouteSDK,
  Trade as RouterTrade,
} from '@uniswap/router-sdk'
import { SwapRouter, RouterTradeType } from '@uniswap/universal-router-sdk'

const MEMSWAP = '0x69f2888491ea07bb10936aa110a5e0481122efd3'

const Swap = () => {
  const [tokenIn, setTokenIn] = useState<Token>()
  const [tokenOut, setTokenOut] = useState<Token>()

  const [amountIn, setAmountIn] = useState('')
  const [amountOut, setAmountOut] = useState('')

  const { address } = useAccount()

  // SwapRouter.swapCallParameters({RouterTradeType.UniswapTrade, })

  const {
    data: tokenInBalance,
    isLoading: fetchingTokenInBalance,
    isError: errorFetchingTokenInBalance,
  } = useBalance({
    address: tokenIn ? address : undefined,
    watch: tokenIn ? true : false,
    token:
      tokenIn && tokenIn?.address !== zeroAddress
        ? (tokenIn?.address as Address)
        : undefined,
  })

  const {
    data: tokenOutBalance,
    isLoading: fetchingTokenOutBalance,
    isError: errorFetchingTokenOutBalance,
  } = useBalance({
    address: tokenOut ? address : undefined,
    watch: tokenOut ? true : false,
    token:
      tokenOut && tokenOut?.address !== zeroAddress
        ? (tokenOut?.address as Address)
        : undefined,
  })

  const { config, error } = usePrepareContractWrite({
    address: MEMSWAP,
    abi: MEMSWAP_ABI,
    functionName: 'execute',
    args: [], //@TODO: configure args
    chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 1),
  })

  const {
    data,
    write: executeSwap,
    reset,
    isLoading,
    isSuccess,
  } = useContractWrite({
    ...config,
    onError: (error) => {
      console.log(error)
    },
    onSuccess: () => {
      console.log('Successfully executed')
    },
  })

  const switchTokens = useCallback(() => {
    const currentTokenIn = tokenIn
    const currentTokenOut = tokenOut
    const currentAmountIn = amountIn
    const currentAmountOut = amountOut

    setTokenIn(currentTokenOut)
    setTokenOut(currentTokenIn)
    setAmountIn(currentAmountOut)
    setAmountOut(currentAmountIn)
  }, [tokenOut, tokenIn, amountOut, amountIn])

  return (
    <Flex
      direction="column"
      css={{
        width: '100%',
        backgroundColor: 'white',
        boxShadow: '0px 0px 50px 0px #0000001F',
        borderRadius: 8,
        p: '4',
        gap: '1',
        maxWidth: 600,
      }}
    >
      <Text style="h5" css={{ mb: '3' }}>
        Swap
      </Text>
      <Flex
        align="start"
        justify="between"
        css={{
          position: 'relative',
          backgroundColor: 'gray8',
          borderRadius: 8,
          p: '5',
        }}
      >
        <Input
          type="number"
          placeholder="0"
          css={{ maxWidth: 100, sm: { maxWidth: 'none' } }}
          value={amountIn}
          onChange={(e) => {
            if (e.target.value) {
              setAmountIn(e.target.value)
            } else {
              setAmountIn('')
            }
          }}
        />
        <Flex direction="column" align="end" css={{ gap: '2' }}>
          <SelectTokenModal token={tokenIn} setToken={setTokenIn} />
          {fetchingTokenInBalance ? <Text>Loading</Text> : null}
          {!fetchingTokenInBalance && errorFetchingTokenInBalance ? (
            <Text>Error</Text>
          ) : null}
          {tokenInBalance ? (
            <Text>Balance: {tokenInBalance?.formatted}</Text>
          ) : null}
        </Flex>
        <Button
          size="xs"
          color="gray4"
          css={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: -24,
            margin: 'auto',
            maxWidth: 'max-content',
            height: 40,
            width: 40,
          }}
          onClick={switchTokens}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </Button>
      </Flex>
      <Flex
        align="start"
        justify="between"
        css={{ backgroundColor: 'gray8', borderRadius: 8, p: '5' }}
      >
        <Input
          type="number"
          placeholder="0"
          css={{ maxWidth: 100, sm: { maxWidth: 'none' } }}
          value={amountOut}
          onChange={(e) => {
            if (e.target.value) {
              setAmountOut(e.target.value)
            } else {
              setAmountOut('')
            }
          }}
        />
        <Flex direction="column" align="end" css={{ gap: '2' }}>
          <SelectTokenModal token={tokenOut} setToken={setTokenOut} />
          {fetchingTokenOutBalance ? <Text>Loading</Text> : null}
          {!fetchingTokenOutBalance && errorFetchingTokenOutBalance ? (
            <Text>Error</Text>
          ) : null}
          {tokenOutBalance ? (
            <Text>Balance: {tokenOutBalance?.formatted}</Text>
          ) : null}
        </Flex>
      </Flex>
      <Button
        color="primary"
        css={{ justifyContent: 'center' }}
        disabled={
          !address ||
          !tokenIn ||
          !tokenOut ||
          !(tokenInBalance && tokenInBalance?.value > 0n)
        }
        onClick={executeSwap}
      >
        SWAP
      </Button>
    </Flex>
  )
}
export default Swap
