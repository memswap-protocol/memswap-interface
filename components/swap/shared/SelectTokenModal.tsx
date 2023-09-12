import {
  CSSProperties,
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { Text, Button, Flex, Input, Box, Img } from '../../primitives'
import { Modal } from '../../common/Modal'
import Fuse from 'fuse.js'
import { FixedSizeList } from 'react-window'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons'
import { LoadingSpinner } from '../../common/LoadingSpinner'
import { useRouter } from 'next/router'
import { Token } from '../../../lib/types'

const fuseSearchOptions = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.2,
  keys: ['name', 'symbol', 'address'],
}

type SelectTokenModalProps = {
  tokenType: 'from' | 'to'
  token?: Token
  setToken: Dispatch<SetStateAction<Token | undefined>>
  tokenList?: Token[]
  loadingTokenList: boolean
}

export const SelectTokenModal: FC<SelectTokenModalProps> = ({
  tokenType,
  token,
  setToken,
  tokenList,
  loadingTokenList,
}) => {
  const [open, setOpen] = useState(false)
  const [tokens, setTokens] = useState(tokenList)

  const router = useRouter()

  useEffect(() => {
    setTokens(tokenList)
  }, [open, tokenList])

  const fuse = new Fuse(tokenList || [], fuseSearchOptions)

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (value.length === 0) {
      setTokens(tokenList)
      return
    }

    const results = fuse.search(value)
    const items = results.map((result) => result.item)
    setTokens(items)
  }

  const TokenRow: FC<{ index: number; style: CSSProperties }> = ({
    index,
    style,
  }) => {
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
          const queryUpdate = { ...router.query }
          queryUpdate[tokenType] = currentToken?.address

          router.push(
            {
              pathname: router.pathname,
              query: queryUpdate,
            },
            undefined,
            {
              shallow: true,
            }
          )
        }}
      >
        <Img
          src={currentToken?.logoURI || ''}
          alt={currentToken?.name || ''}
          width={24}
          height={24}
          css={{
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
          size="small"
          corners="pill"
          css={{
            justifyContent: 'space-between',
            flexShrink: 0,
            width: 'max-content',
          }}
        >
          {token ? (
            <>
              <Img
                src={token?.logoURI || ''}
                alt={token?.name}
                width={24}
                height={24}
                css={{
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                }}
              />{' '}
              <Text ellipsify>{token?.symbol}</Text>
            </>
          ) : (
            <Text css={{ color: 'white' }} ellipsify>
              Select token
            </Text>
          )}
          <FontAwesomeIcon icon={faChevronDown} width={16} height={16} />
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
          css={{
            mb: '1',
            _placeholder: {
              textOverflow: 'ellipsis',
            },
          }}
          onChange={(e) => handleSearch(e)}
        />
        {loadingTokenList ? (
          <Flex direction="column" align="center" css={{ py: '6' }}>
            <LoadingSpinner />
          </Flex>
        ) : (
          <FixedSizeList
            itemCount={tokens?.length || 0}
            height={400}
            itemSize={50}
            width={'100%'}
          >
            {TokenRow}
          </FixedSizeList>
        )}
      </Flex>
    </Modal>
  )
}
