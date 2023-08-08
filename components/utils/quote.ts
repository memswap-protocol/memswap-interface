import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { Address, createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'

const client = createPublicClient({
  chain: mainnet,
  transport: http(),
})

export async function quote(
  tokenIn: Token,
  tokenOut: Token,
  feeAmount: FeeAmount,
  amountIn: number
) {
  const poolConstants = await getPoolConstants(tokenIn, tokenOut, feeAmount)

  const quotedAmountOut = await client.simulateContract({
    address: QUOTER_CONTRACT_ADDRESS,
    abi: Quoter.abi,
    functionName: 'quoteExactInputSingle',
    args: [
      poolConstants.token0,
      poolConstants.token1,
      poolConstants.fee,
      BigInt(amountIn),
      0,
    ],
  })

  console.log('Quoted Amount Out: ', quotedAmountOut)

  // return quotedAmountOut

  // return toReadableAmount(quotedAmountOut, CurrentConfig.tokens.out.decimals)
}

async function getPoolConstants(
  tokenIn: Token,
  tokenOut: Token,
  feeAmount: FeeAmount
): Promise<{
  token0: string
  token1: string
  fee: number
}> {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: feeAmount,
  })

  // const poolContract = new ethers.Contract(
  //   currentPoolAddress,
  //   IUniswapV3PoolABI.abi,
  //   getProvider()
  // )

  const [token0, token1, fee] = await Promise.all([
    client.readContract({
      address: currentPoolAddress as Address,
      abi: IUniswapV3PoolABI.abi,
      functionName: 'token0',
    }),
    client.readContract({
      address: currentPoolAddress as Address,
      abi: IUniswapV3PoolABI.abi,
      functionName: 'token1',
    }),
    client.readContract({
      address: currentPoolAddress as Address,
      abi: IUniswapV3PoolABI.abi,
      functionName: 'fee',
    }),
  ])

  return {
    token0,
    token1,
    fee,
  }
}
