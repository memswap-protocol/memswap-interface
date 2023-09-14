import { FC, useEffect, useState } from 'react'
import { Anchor, Box, Button, ErrorWell, Flex, Text } from '../primitives'
import {
  erc20ABI,
  useAccount,
  useContractEvent,
  usePublicClient,
  useWalletClient,
} from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Modal } from '../common/Modal'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { truncateAddress } from '../../lib/utils/truncate'
import {
  encodeIntentAbiParameters,
  getEIP712Domain,
  getEIP712Types,
  getIntentHash,
  now,
  postPublicIntentToMatchmaker,
} from '../../lib/utils/swap'
import { _TypedDataEncoder } from '@ethersproject/hash'
import {
  parseUnits,
  zeroAddress,
  encodeFunctionData,
  parseAbiItem,
  Address,
  formatUnits,
} from 'viem'
import {
  signTypedData,
  sendTransaction,
  readContract,
  writeContract,
} from '@wagmi/core'
import { useToast } from '../../hooks/useToast'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { IntentInfo } from './token-swap/IntentInfo'
import { useMounted, useSupportedNetwork, useWethEthSwap } from '../../hooks'
import { MEMSWAP_ERC20_ABI, MEMSWAP_ERC721_ABI } from '../../lib/constants/abis'
import {
  MATCHMAKER,
  MATCHMAKER_API,
  MEMSWAP_ERC20,
  MEMSWAP_ERC721,
  MEMSWAP_WETH,
  WRAPPED_CONTRACTS,
} from '../../lib/constants/contracts'
import {
  FetchBalanceResult,
  IntentERC20,
  IntentERC721,
  Protocol,
  SwapMode,
  Token,
} from '../../lib/types'
import axios from 'axios'

enum SwapStep {
  Sign,
  MetamaskApproval,
  PrivateModeUnsupportedWallet,
  Submit,
}

type SwapModalProps = {
  protocol: Protocol
  isBuy: boolean
  tokenIn?: Token
  tokenOut?: Token
  tokenInBalance?: FetchBalanceResult
  tokenOutBalance?: FetchBalanceResult
  referrer?: Address
  amountIn: string
  amountOut: string
  slippagePercentage: string
  deadline: string
  swapMode: SwapMode
  isFetchingQuote: boolean
  errorFetchingQuote: boolean
}

export const SwapModal: FC<SwapModalProps> = ({
  protocol,
  isBuy,
  tokenIn,
  tokenOut,
  tokenInBalance,
  tokenOutBalance,
  referrer,
  amountIn,
  amountOut,
  slippagePercentage,
  deadline,
  swapMode,
  isFetchingQuote,
  errorFetchingQuote,
}) => {
  // Configuration
  const isMounted = useMounted()
  const { chain } = useSupportedNetwork()
  const { address, isDisconnected, isConnecting, connector } = useAccount()
  const { openConnectModal } = useConnectModal()
  const { toast } = useToast()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  // States
  const [open, setOpen] = useState(false)
  const [swapStep, setSwapStep] = useState<SwapStep>(SwapStep.Sign)
  const [error, setError] = useState<Error | undefined>()
  const [txHash, setTxHash] = useState<Address | undefined>()
  const [txSuccess, setTxSuccess] = useState(false)
  const [metamaskApprovalHash, setMetamaskApprovalHash] = useState<
    Address | undefined
  >()
  const [waitingForFulfillment, setWaitingForFulfillment] = useState(false)
  const [fulfilledHash, setFulfilledHash] = useState<Address | undefined>()
  const [fulfilledSuccess, setFulfilledSuccess] = useState(false)
  const [intentHash, setIntentHash] = useState<string | undefined>()

  // Conditional Variables
  const memswapAbi =
    protocol === Protocol.ERC20 ? MEMSWAP_ERC20_ABI : MEMSWAP_ERC721_ABI
  const memswapContract =
    protocol === Protocol.ERC20
      ? MEMSWAP_ERC20[chain.id]
      : MEMSWAP_ERC721[chain.id]
  const memswapWethContract = MEMSWAP_WETH[chain.id]
  const matchmakerApi = MATCHMAKER_API[chain.id]
  const isMetamaskWallet = connector?.id === 'metaMask'

  const isEthToWethSwap =
    tokenIn?.address === zeroAddress &&
    tokenOut?.address === WRAPPED_CONTRACTS[chain.id]
  const isWethToEthSwap =
    tokenIn?.address === WRAPPED_CONTRACTS[chain.id] &&
    tokenOut?.address === zeroAddress

  // Reset state on modal close
  useEffect(() => {
    if (!open) {
      setSwapStep(SwapStep.Sign)
      setError(undefined)
      setTxHash(undefined)
      setTxSuccess(false)
      setMetamaskApprovalHash(undefined)
      setFulfilledHash(undefined)
      setFulfilledSuccess(false)
    }
  }, [open])

  // Execute Swap
  const swap = async () => {
    if (!address) {
      throw Error('No wallet connected')
    }
    if (!publicClient) {
      throw Error('Missing public client')
    }
    if (!walletClient) {
      throw Error('Missing wallet client')
    }
    if (!tokenIn?.address || !tokenOut?.address) {
      throw Error('Missing tokenIn or tokenOut address')
    }
    if (swapMode === 'Private' && isMetamaskWallet) {
      setSwapStep(SwapStep.PrivateModeUnsupportedWallet)
      return
    }

    try {
      const parsedAmountIn = parseUnits(amountIn, tokenIn?.decimals ?? 18)
      const parsedAmountOut = parseUnits(amountOut, tokenOut?.decimals ?? 18)

      // When isBuy = true:
      // amount = buy amount
      // endAmount = sell end amount
      // startAmountBps = sell start amount bps
      // expectedAmountBps = sell expected amount bps

      // When isBuy = false:
      // amount = sell amount
      // endAmount = buy end amount
      // startAmountBps = buy start amount bps
      // expectedAmountBps = buy expected amount bps

      let amount
      let endAmount

      if (isBuy) {
        amount = parsedAmountOut
        endAmount = parsedAmountIn
      } else {
        amount = parsedAmountIn
        endAmount = parsedAmountOut
      }

      let startAmountBps
      let expectedAmountBps

      const slippageAmountBps = Number(slippagePercentage) * 100

      if (swapMode === 'Dutch') {
        startAmountBps = slippageAmountBps
        expectedAmountBps = slippageAmountBps
      } else {
        startAmountBps = 0
        expectedAmountBps = slippageAmountBps
      }

      const processedTokenInAddress =
        tokenIn?.address === zeroAddress
          ? memswapWethContract
          : tokenIn?.address

      // Create Intent
      const intent: IntentERC20 | IntentERC721 = {
        isBuy: isBuy,
        buyToken: tokenOut?.address,
        sellToken: processedTokenInAddress,
        maker: address,
        solver: swapMode === 'Dutch' ? zeroAddress : MATCHMAKER[chain.id],
        source: referrer ?? address,
        feeBps: 0,
        surplusBps: 0,
        startTime: now(),
        endTime: await publicClient
          .getBlock()
          .then((b) => Number(b!.timestamp) + Number(deadline) * 60),
        nonce: '0',
        isPartiallyFillable: false,
        isSmartOrder: false,
        ...(protocol === Protocol.ERC721
          ? { isCriteriaOrder: false, tokenIdOrCriteria: '0' }
          : {}),
        amount: amount.toString(),
        endAmount: endAmount.toString(),
        startAmountBps: startAmountBps,
        expectedAmountBps: expectedAmountBps,
        // Mock value to pass type checks
        signature: '0x',
      }

      intent.signature = await signTypedData({
        domain: getEIP712Domain(chain.id, protocol),
        types: getEIP712Types(protocol),
        message: intent,
        primaryType: 'Intent',
      })

      // Encode approval and intent
      const approveMethod =
        processedTokenInAddress === memswapWethContract
          ? 'depositAndApprove'
          : 'approve'

      const approveAbiItem = parseAbiItem(
        `function ${approveMethod}(address spender, uint256 amount)`
      )

      const encodedApprovalData = encodeFunctionData({
        abi: [approveAbiItem],
        args: [memswapContract, parsedAmountIn],
      })

      const encodedIntentData = encodeIntentAbiParameters(intent)

      const combinedEndcodedData =
        encodedApprovalData + encodedIntentData.slice(2)

      // Fetch user's approved allowance for memswap on tokenIn contract
      const allowanceAmount = await readContract({
        address: processedTokenInAddress,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address, memswapContract],
      })

      const alreadyHasApproval = allowanceAmount >= parsedAmountIn

      // Generate intent hash and start listing for 'IntentSolved' Event in useContractEvent hook
      // The intent could be solved in the same block that it is submitted, so we need to start listening before
      // we submit the transaction
      const intentHash = getIntentHash(intent)

      setIntentHash(intentHash)
      setWaitingForFulfillment(true)

      /////////////////////////////////////////////////////////////////////
      // Handle transactions
      /////////////////////////////////////////////////////////////////////

      // Scenario 1: Private order
      // For private orders, submit a signed tx directly to the matchmaker's api
      if (swapMode === 'Private') {
        const provider = await connector?.getProvider()

        // @TODO: verify data and value are correct values
        const privateTxSignature = await provider.request({
          method: 'eth_signTransaction',
          params: [
            {
              to: processedTokenInAddress,
              from: address,
              data: alreadyHasApproval
                ? encodedIntentData
                : combinedEndcodedData,
              value:
                !alreadyHasApproval && approveMethod === 'depositAndApprove'
                  ? Number(parsedAmountIn)
                  : 0,
              chain: chain,
              nonce: await publicClient?.getTransactionCount({ address }),
            },
          ],
        })

        const protocolRoute = protocol === Protocol.ERC721 ? 'erc721' : 'erc20'

        await axios.post(`${matchmakerApi}/${protocolRoute}/intents/private`, {
          intent,
          approvalTxOrTxHash: privateTxSignature,
        })
      }

      // Scenario 2: User already has given approval greater than the amountIn
      else if (alreadyHasApproval) {
        setSwapStep(SwapStep.Submit)

        // Otherwise, call 'post' method on Memswap contract
        const { hash } = await writeContract({
          address: memswapContract,
          // @ts-ignore @TODO
          abi: memswapAbi,
          functionName: 'post',
          // @ts-ignore @TODO: intent type differs from abi - amount and endAmount should be bigints
          args: [[intent]],
          account: address,
          chainId: chain.id,
        })

        setTxHash(hash)

        await publicClient.waitForTransactionReceipt({
          hash: hash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
          confirmations: 0,
        })

        // @TODO: Should we be sending these concurrently?

        // For faster distribution, also submit tx to matchmaker's api
        await postPublicIntentToMatchmaker(chain.id, intent, hash)
      }

      // Scenario 3: User is using metamask wallet and approve method = approve
      // For metamask, an extra tx is required because the wallet strips away any appended calldata
      // https://github.com/MetaMask/metamask-extension/issues/20439
      // 2 Separate transactions, 1 for approval, 1 to call 'post' method on Memswap contract
      else if (isMetamaskWallet && approveMethod === 'approve') {
        setSwapStep(SwapStep.MetamaskApproval)

        const { hash: approvalHash } = await sendTransaction({
          chainId: chain.id,
          to: processedTokenInAddress,
          account: address,
          value: 0n,
          data: encodedApprovalData,
        })

        setMetamaskApprovalHash(approvalHash)

        await publicClient.waitForTransactionReceipt({
          hash: approvalHash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
          confirmations: 0,
        })

        setSwapStep(SwapStep.Submit)

        const { hash: intentTransactionHash } = await writeContract({
          chainId: chain.id,
          address: memswapContract,
          // @ts-ignore @TODO
          abi: memswapAbi,
          functionName: 'post',
          // @ts-ignore @TODO: intent type differs from abi - amount and endAmount should be bigints
          args: [[intent]],
          account: address,
        })

        setTxHash(intentTransactionHash)

        await publicClient.waitForTransactionReceipt({
          hash: intentTransactionHash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
          confirmations: 0,
        })

        // For faster distribution, also submit tx to matchmaker's api
        await postPublicIntentToMatchmaker(
          chain.id,
          intent,
          intentTransactionHash
        )
      }

      // Scenario 4: Normal swap (user has not already given approval, is not using metamask wallet,
      // is not wrapping/unwrapping ETH)
      // 1 transaction with the intent appended to the approval
      else {
        setSwapStep(SwapStep.Submit)

        const { hash } = await sendTransaction({
          chainId: chain.id,
          to: processedTokenInAddress,
          account: address,
          value: approveMethod === 'depositAndApprove' ? parsedAmountIn : 0n,
          data: combinedEndcodedData as Address,
        })

        setTxHash(hash)

        await publicClient.waitForTransactionReceipt({
          hash: hash,
          onReplaced: (replacement) => {
            setTxHash(replacement?.transaction?.hash),
              console.log('Transaction replaced')
          },
          confirmations: 0,
        })

        // For faster distribution, also submit tx to matchmaker's api
        await postPublicIntentToMatchmaker(chain.id, intent, hash)
      }

      setTxSuccess(true)
    } catch (err: any) {
      console.error(err)
      const error = err as Error
      if (err?.code === 4001 || error?.name === 'UserRejectedRequestError') {
        error.message = 'User rejected the transaction.'
      } else if (error?.name === 'TransactionExecutionError') {
        error.message = 'Transaction failed.'
      } else {
        error.message = 'Oops, something went wrong.'
      }
      toast({
        title: error.message,
      })
      setError(error)
    }
  }

  // WETH<>ETH Swap
  const { handleWethEthSwap } = useWethEthSwap({
    tokenIn,
    amountIn,
    mode: isEthToWethSwap ? 'wrap' : 'unwrap',
    enabled: isEthToWethSwap || isWethToEthSwap,
  })

  // Listen for 'IntentSolved' Event for with the submitted intent hash
  const unwatch = useContractEvent({
    chainId: chain.id,
    address: waitingForFulfillment ? memswapContract : undefined,
    abi: memswapAbi,
    eventName: 'IntentSolved',
    // @TODO: add timeout
    listener(log) {
      const eventIntentHash = log[0]?.args?.intentHash
      if (eventIntentHash === intentHash) {
        unwatch?.()
        toast({
          title: 'Swap was successful.',
          action: log[0]?.transactionHash ? (
            <Anchor
              href={`${chain.blockExplorers?.default?.url}/tx/${log[0]?.transactionHash}`}
              target="_blank"
            >
              View on {chain.blockExplorers?.default?.name}:{' '}
              {truncateAddress(log[0]?.transactionHash)}
            </Anchor>
          ) : null,
        })
        const eventFulfilledHash = log[0]?.transactionHash
        setFulfilledHash(eventFulfilledHash)
        setFulfilledSuccess(true)
        setWaitingForFulfillment(false)
      }
    },
  })

  const isBalanceInsufficient =
    Number(
      formatUnits(tokenInBalance?.value || 0n, tokenInBalance?.decimals ?? 18)
    ) < Number(amountIn)

  function getButtonText() {
    if (isDisconnected || isConnecting) {
      return 'Connect Wallet'
    }
    if (!tokenOut || !tokenIn) {
      return 'Select a token'
    }
    if (isBalanceInsufficient) {
      return 'Insufficient Balance'
    }
    if (!amountIn) {
      return `Enter an amount`
    }
    if (tokenIn?.symbol === 'ETH' && tokenOut?.symbol === 'WETH') {
      return 'Wrap'
    }
    if (tokenIn?.symbol === 'WETH' && tokenOut?.symbol === 'ETH') {
      return 'Unwrap'
    }
    return 'Swap'
  }

  const trigger = (
    <Button
      color="primary"
      css={{ justifyContent: 'center' }}
      onClick={() => {
        if (isDisconnected) {
          openConnectModal?.()
        } else if (isEthToWethSwap || isWethToEthSwap) {
          handleWethEthSwap?.()
        } else {
          swap()
        }
      }}
      disabled={
        isDisconnected || isConnecting
          ? false
          : !address ||
            !tokenIn ||
            !tokenOut ||
            isFetchingQuote ||
            errorFetchingQuote ||
            !(Number(amountOut) > 0) ||
            Number(amountIn) === 0 ||
            isBalanceInsufficient
      }
    >
      {getButtonText()}
    </Button>
  )

  if (!isMounted) {
    return null
  }

  return (
    <Modal
      trigger={trigger}
      open={open}
      onOpenChange={(open) => {
        if (!isDisconnected && !(isEthToWethSwap || isWethToEthSwap)) {
          setOpen(open)
        }
      }}
      contentCss={{ width: '100%' }}
    >
      {swapStep === SwapStep.Sign ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          {error ? (
            <ErrorWell css={{ width: '100%' }} message={error?.message} />
          ) : null}
          <Text style="h5">Sign your order</Text>
          <IntentInfo
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            amountIn={amountIn}
            amountOut={amountOut}
          />
          {error ? (
            <Button
              onClick={() => {
                setError(undefined)
                swap()
              }}
              css={{ justifyContent: 'center', width: '100%' }}
            >
              Retry
            </Button>
          ) : (
            <Button
              disabled={true}
              css={{ justifyContent: 'center', width: '100%' }}
            >
              <LoadingSpinner />
              Sign Order
            </Button>
          )}
        </Flex>
      ) : null}
      {swapStep === SwapStep.MetamaskApproval ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          {error ? (
            <ErrorWell css={{ width: '100%' }} message={error?.message} />
          ) : null}
          <Text style="h5">
            Approve {tokenIn?.symbol} to be used for swapping.
          </Text>
          <Text style="body1" css={{ textAlign: 'center' }}>
            For ERC-20 swaps using Metamask, an additional transaction is needed
            for custom approval handling. To avoid this, you can use a different
            wallet.
          </Text>
          {metamaskApprovalHash ? (
            <Anchor
              href={`${chain.blockExplorers?.default?.url}/tx/${metamaskApprovalHash}`}
              target="_blank"
            >
              View on {chain.blockExplorers?.default?.name}:{' '}
              {truncateAddress(metamaskApprovalHash)}
            </Anchor>
          ) : null}
          <Button
            disabled={!error}
            css={{ justifyContent: 'center', width: '100%' }}
            onClick={() => setOpen(false)}
          >
            {error ? (
              'Close'
            ) : (
              <>
                <LoadingSpinner />
                Approve Transaction
              </>
            )}
          </Button>
        </Flex>
      ) : null}
      {swapStep === SwapStep.PrivateModeUnsupportedWallet ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          <Text style="h5">Please use a different wallet</Text>
          <Text style="subtitle1" color="subtle" css={{ textAlign: 'center' }}>
            Your wallet requires all transactions to be sent to the public
            mempool. While your order can be kept private, the approval
            transaction would be public, which can be used to infer your
            intentions. Most other wallets (e.g. Rainbow) allow fully private
            transactions.
          </Text>
        </Flex>
      ) : null}
      {swapStep === SwapStep.Submit ? (
        <Flex
          align="center"
          direction="column"
          css={{ width: '100%', gap: 24, pt: '5' }}
        >
          {error ? (
            <ErrorWell css={{ width: '100%' }} message={error?.message} />
          ) : null}
          <Text style="h5">Confirm Swap</Text>

          <IntentInfo
            tokenIn={tokenIn}
            tokenOut={tokenOut}
            amountIn={amountIn}
            amountOut={amountOut}
          />
          <Flex direction="column" css={{ gap: '3', width: '100%' }}>
            <Flex
              direction="column"
              css={{
                backgroundColor: 'gray2',
                p: '4',
                borderRadius: 8,
                gap: '2',
              }}
            >
              <Flex justify="between" align="center">
                <Text style="subtitle1">Submit yor order</Text>

                {txSuccess ? (
                  <Box css={{ color: 'green10' }}>
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      style={{ width: 20, height: 20 }}
                    />
                  </Box>
                ) : (
                  <LoadingSpinner />
                )}
              </Flex>
              {txHash ? (
                <Anchor
                  href={`${chain.blockExplorers?.default?.url}/tx/${txHash}`}
                  target="_blank"
                >
                  View on {chain.blockExplorers?.default?.name}:{' '}
                  {truncateAddress(txHash)}
                </Anchor>
              ) : null}
            </Flex>
            <Flex
              direction="column"
              css={{
                backgroundColor: 'gray2',
                p: '4',
                borderRadius: 8,
                gap: '2',
              }}
            >
              <Flex justify="between" align="center">
                <Text style="subtitle1">Wait for the swap to be fulfilled</Text>

                {fulfilledSuccess ? (
                  <Box css={{ color: 'green10' }}>
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      style={{ width: 20, height: 20 }}
                    />
                  </Box>
                ) : (
                  <LoadingSpinner />
                )}
              </Flex>
              {fulfilledHash ? (
                <Anchor
                  href={`${chain.blockExplorers?.default?.url}/tx/${fulfilledHash}`}
                  target="_blank"
                >
                  View on {chain.blockExplorers?.default?.name}:{' '}
                  {truncateAddress(fulfilledHash)}
                </Anchor>
              ) : txSuccess && !fulfilledSuccess ? (
                <Text color="subtle" style="body2">
                  You can close this modal while waiting for the swap to be
                  fulfilled. The transaction will continue in the background.
                </Text>
              ) : null}
            </Flex>
          </Flex>
        </Flex>
      ) : null}
    </Modal>
  )
}
