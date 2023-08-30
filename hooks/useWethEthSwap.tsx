import { parseUnits } from 'ethers/lib/utils'
import { WRAPPED_CONTRACTS } from '../constants/contracts'
import { WETH_ABI } from '../constants/abis'
import { useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi'
import { Token } from '../types'
import { Anchor } from '../components/primitives'
import { useToast } from './useToast'
import { truncateAddress } from '../utils/truncate'

type WethEthSwapType = {
  tokenIn?: Token
  amountIn: string
  mode: 'wrap' | 'unwrap'
  enabled: boolean
}

// Used to wrap ETH or unwrap WETH
const useWethEthSwap = ({
  tokenIn,
  amountIn,
  mode,
  enabled,
}: WethEthSwapType) => {
  const { chain: activeChain } = useNetwork()
  const { toast } = useToast()

  const parsedAmountIn = amountIn
    ? parseUnits(amountIn, tokenIn?.decimals || 18)
    : undefined

  // Prepare ETH <> WETH Swap
  const { config } = usePrepareContractWrite({
    address: WRAPPED_CONTRACTS[activeChain?.id || 1],
    abi: WETH_ABI,
    functionName: mode === 'wrap' ? 'deposit' : 'withdraw',
    // @ts-ignore @TODO: infer types
    args: mode === 'unwrap' ? [parsedAmountIn] : undefined,
    // @ts-ignore
    value: mode === 'wrap' ? parsedAmountIn : undefined,
    enabled: enabled,
    chainId: activeChain?.id,
  })

  // Execute ETH <> WETH Swap
  const { write: handleWethEthSwap } = useContractWrite({
    ...config,
    onSuccess(data) {
      toast({
        title: 'Swap transaction sent.',
        action: data?.hash ? (
          <Anchor
            href={`${activeChain?.blockExplorers?.default?.url}/tx/${data?.hash}`}
            target="_blank"
          >
            View on {activeChain?.blockExplorers?.default?.name}:{' '}
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
