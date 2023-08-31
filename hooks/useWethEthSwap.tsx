import { parseUnits } from 'ethers/lib/utils'
import { WRAPPED_CONTRACTS } from '../constants/contracts'
import { WETH_ABI } from '../constants/abis'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { Token } from '../types'
import { Anchor } from '../components/primitives'
import { useToast } from './useToast'
import { truncateAddress } from '../utils/truncate'
import useSupportedNetwork from './useSupportedNetwork'

type WethEthSwapType = {
  tokenIn?: Token
  amountIn: string
  mode: 'wrap' | 'unwrap'
  enabled: boolean
}

// Wrap ETH or unwrap WETH
const useWethEthSwap = ({
  tokenIn,
  amountIn,
  mode,
  enabled,
}: WethEthSwapType) => {
  const { chain } = useSupportedNetwork()
  const { toast } = useToast()

  const parsedAmountIn = amountIn
    ? parseUnits(amountIn, tokenIn?.decimals || 18)
    : undefined

  const { config } = usePrepareContractWrite({
    address: WRAPPED_CONTRACTS[chain.id],
    abi: WETH_ABI,
    functionName: mode === 'wrap' ? 'deposit' : 'withdraw',
    // @ts-ignore @TODO: infer correct types
    args: mode === 'unwrap' ? [parsedAmountIn] : undefined,
    // @ts-ignore
    value: mode === 'wrap' ? parsedAmountIn : undefined,
    enabled: enabled,
    chainId: chain.id,
  })

  const { write: handleWethEthSwap } = useContractWrite({
    ...config,
    onSuccess(data) {
      toast({
        title: 'Swap transaction sent.',
        action: data?.hash ? (
          <Anchor
            href={`${chain.blockExplorers?.default?.url}/tx/${data?.hash}`}
            target="_blank"
          >
            View on {chain.blockExplorers?.default?.name}:{' '}
            {truncateAddress(data?.hash)}
          </Anchor>
        ) : null,
      })
    },
    onError(error) {
      if (
        error?.name === 'UserRejectedRequestError' ||
        error?.message.startsWith('User rejected ')
      ) {
        error.message = 'User rejected the transaction.'
      } else {
        error.message = 'Oops, the transaction failed.'
      }
      toast({
        title: error.message,
      })
    },
  })

  return {
    handleWethEthSwap,
  }
}

export default useWethEthSwap
