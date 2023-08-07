import { Dispatch, FC, SetStateAction, useState } from 'react'
import { Text, Button, Flex } from '../primitives'
import { Modal } from '../common/Modal'
import Image from 'next/image'
import { useTokenList } from '../../hooks'

type Props = {
  currency?: Currency
  setCurrency: Dispatch<SetStateAction<Currency | undefined>>
}

export type Currency = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export const SelectCurrency: FC<Props> = ({ currency, setCurrency }) => {
  const [open, setOpen] = useState(false)

  const { tokens, loading, error } = useTokenList()

  return (
    <Modal
      trigger={
        <Button color="primary" size="medium">
          {currency ? (
            <>
              <Image
                src={currency?.logoURI || ''}
                alt={currency?.name}
                width={30}
                height={30}
                style={{
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                }}
              />{' '}
              <Text ellipsify>{currency?.symbol}</Text>
            </>
          ) : (
            'Select Currency'
          )}
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
        css={{ width: '100%', height: '100%', gap: '2', overflow: 'hidden' }}
      >
        <Text style="h6">Select a currency</Text>
        <Flex
          direction="column"
          css={{ overflowY: 'scroll', maxHeight: '600px', gap: '1' }}
        >
          {/* @TODO: add loading indicator and error state */}
          {tokens?.map((token, index) => {
            const isSelected = token?.address === currency?.address
            return (
              <Flex
                key={index}
                css={{
                  cursor: 'pointer',
                  borderRadius: 4,
                  p: '1',
                  gap: '3',
                  backgroundColor: isSelected ? 'primary11' : 'transparent',
                  _hover: { backgroundColor: 'gray8' },
                }}
                onClick={() => {
                  setCurrency(token)
                  setOpen(false)
                }}
              >
                <Image
                  src={token?.logoURI || ''}
                  alt={token?.name}
                  width={30}
                  height={30}
                  style={{
                    aspectRatio: '1/1',
                    borderRadius: '50%',
                  }}
                />
                <Text>
                  {token?.name} ({token?.symbol})
                </Text>
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    </Modal>
  )
}
