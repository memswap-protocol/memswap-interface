import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { Text, Button, Flex, Input, Box } from '../primitives'
import { Modal } from '../common/Modal'
import { useTokenList } from '../../hooks'
import Fuse from 'fuse.js'
import { FixedSizeList } from 'react-window'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'

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
          borderRadius: 16,
          p: '1',
          px: '2',
          gap: '3',
          backgroundColor: isSelected ? 'gray5' : 'transparent',
          _hover: { backgroundColor: 'gray3' },
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
        <Flex direction="column" css={{}}>
          <Text style="h6" ellipsify>
            {currentToken?.name}
          </Text>
          <Text style="subtitle2" color="subtle">
            {currentToken?.symbol}
          </Text>
        </Flex>
      </Flex>
    )
  }

  return (
    <Modal
      trigger={
        <Button
          color={token ? 'white' : 'black'}
          size="medium"
          corners="pill"
          css={{
            justifyContent: 'space-between',
            flexShrink: 0,
            width: 'max-content',
          }}
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
        css={{ width: '100%', height: '100%', gap: '3' }}
      >
        <Text style="h5">Select a token</Text>
        <Input
          placeholder="Search name or address"
          icon={
            <Box css={{ color: 'gray9' }}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Box>
          }
          css={{ mb: '1' }}
          onChange={(e) => handleSearch(e)}
        />
        {/* @TODO: add loading indicator and error state */}
        <FixedSizeList
          itemCount={tokens?.length || 0}
          height={400}
          itemSize={50}
          width={'100%'}
        >
          {TokenRow}
        </FixedSizeList>
      </Flex>
    </Modal>
  )
}
