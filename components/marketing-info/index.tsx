import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Flex, Text, Anchor, Box } from '../primitives'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FeatureHighlightPill } from './FeatureHighlightPill'

const featureHighlights = ['Permissionless', 'Secure', 'Decentralized', 'Open']

export const Marketing = () => {
  return (
    <Flex
      direction="column"
      align="center"
      css={{
        gap: '4',
        maxWidth: 540,
      }}
    >
      <Flex align="center" justify="center" css={{ gap: 18, flexWrap: 'wrap' }}>
        {featureHighlights.map((highlight, idx) => (
          <FeatureHighlightPill text={highlight} key={idx} />
        ))}
      </Flex>
      <Text style="subtitle1" css={{ textAlign: 'center' }}>
        MemSwap is an “intents-based” swap protocol that provides best-in-class
        price execution.
      </Text>
      {/* @TODO: add links */}
      <Flex align="center" direction="column" css={{ gap: 24 }}>
        <Anchor href="" target="_blank">
          <Flex align="center" css={{ gap: '2', width: '100%' }}>
            Learn more about the protocol
            <Box>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Box>
          </Flex>
        </Anchor>
        <Anchor
          href=""
          target="_blank"
          css={{ display: 'block', md: { display: 'none' } }}
        >
          <Flex align="center" css={{ gap: '2' }}>
            Docs <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </Flex>
        </Anchor>
      </Flex>
    </Flex>
  )
}
