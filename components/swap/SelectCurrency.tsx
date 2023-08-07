import { Dispatch, FC, SetStateAction, useState } from 'react'
import { Text, Button, Flex } from '../primitives'
import { Modal } from '../common/Modal'
import Image from 'next/image'
import { useTokenList } from '../../hooks'

type Props = {
  token?: Token
  setToken: Dispatch<SetStateAction<Token | undefined>>
}

export type Token = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export const SelectCurrency: FC<Props> = ({ token, setToken }) => {
  const [open, setOpen] = useState(false)

  const { tokens, loading, error } = useTokenList()

  return (
    <Modal
      trigger={
        <Button color="primary" size="medium">
          {token ? (
            <>
              <Image
                src={token?.logoURI || ''}
                alt={token?.name}
                width={30}
                height={30}
                style={{
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                }}
              />{' '}
              <Text ellipsify>{token?.symbol}</Text>
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
        <Text style="h6">Select a token</Text>
        <Flex
          direction="column"
          css={{ overflowY: 'scroll', maxHeight: '600px', gap: '1' }}
        >
          {/* @TODO: add loading indicator and error state */}
          {tokens?.map((currentToken, index) => {
            const isSelected = currentToken?.address === token?.address
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
                  setToken(currentToken)
                  setOpen(false)
                }}
              >
                <Image
                  src={currentToken?.logoURI || ''}
                  alt={currentToken?.name}
                  width={30}
                  height={30}
                  style={{
                    aspectRatio: '1/1',
                    borderRadius: '50%',
                  }}
                />
                <Text>
                  {currentToken?.name} ({currentToken?.symbol})
                </Text>
              </Flex>
            )
          })}
        </Flex>
      </Flex>
    </Modal>
  )
}
