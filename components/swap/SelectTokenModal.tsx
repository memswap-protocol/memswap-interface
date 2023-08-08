import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { Text, Button, Flex, Input } from '../primitives'
import { Modal } from '../common/Modal'
import { useTokenList } from '../../hooks'
import Fuse from 'fuse.js'
import { FixedSizeList } from 'react-window'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

const fuseSearchOptions = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  keys: ['name', 'symbol', 'address'],
}

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

export const SelectTokenModal: FC<Props> = ({ token, setToken }) => {
  const [open, setOpen] = useState(false)
  const { tokens: tokenData, loading, error } = useTokenList()
  const [tokens, setTokens] = useState(tokenData)

  useEffect(() => {
    setTokens(tokenData)
  }, [open, tokenData])

  const fuse = new Fuse(tokenData || [], fuseSearchOptions)

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (value.length === 0) {
      setTokens(tokenData)
      return
    }

    const results = fuse.search(value)
    const items = results.map((result) => result.item)
    setTokens(items)
  }

  // @ts-ignore: ignore react-window 'any' types
  const TokenRow = ({ index, style }) => {
    const currentToken = tokens?.[index]
    const isSelected = currentToken?.address === token?.address
    return (
      <Flex
        style={style}
        key={index}
        align="center"
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
        <img
          src={currentToken?.logoURI || ''}
          alt={currentToken?.name || ''}
          width={24}
          height={24}
          style={{
            aspectRatio: '1/1',
            borderRadius: '50%',
          }}
        />
        <Text style="subtitle1" ellipsify>
          {currentToken?.name} ({currentToken?.symbol})
        </Text>
      </Flex>
    )
  }

  return (
    <Modal
      trigger={
        <Button
          color="gray4"
          size="medium"
          css={{ justifyContent: 'space-between' }}
        >
          {token ? (
            <>
              <img
                src={token?.logoURI || ''}
                alt={token?.name}
                width={24}
                height={24}
                style={{
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                }}
              />{' '}
              <Text ellipsify>{token?.symbol}</Text>
            </>
          ) : (
            'Select Token'
          )}
          <FontAwesomeIcon icon={faChevronDown} />
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
        css={{ width: '100%', height: '100%', gap: '2' }}
      >
        <Text style="h6">Select a token</Text>
        <Input
          placeholder="Search name or address"
          css={{ mb: '1' }}
          onChange={(e) => handleSearch(e)}
        />
        {/* @TODO: add loading indicator and error state */}
        <FixedSizeList
          itemCount={tokens?.length || 0}
          height={300}
          itemSize={38}
          width={'100%'}
        >
          {TokenRow}
        </FixedSizeList>
      </Flex>
    </Modal>
  )
}
