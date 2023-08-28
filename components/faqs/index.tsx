import { ReactNode } from 'react'
import { Flex, Text } from '../primitives'
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from '../primitives/Accordion'

type FAQ = {
  question: string
  answer: ReactNode
}

const faqs: FAQ[] = [
  {
    question: 'What is MemSwap?',
    answer:
      'MemSwap is a new “intents-based” swap protocol that leverages dutch auctions and propagates intents using the ethereum mempool, through a method called intentful transactions. The core protocol can be used as a fully decentralized swap aggregator. On top of the core, MemSwap introduces open-source and opt-in matchmakers that improve price execution, without relying on any individual central actor. The canonical MemSwap matchmaker provides better price execution by enabling an open market for searchers to fill one or many (partial) intents.',
  },
  {
    question: 'How is it decentralized?',
    answer: 'It just is.',
  },
  {
    question: 'What is a matchmaker?',
    answer: 'A matchmaker is…',
  },
  {
    question: 'Do I get the best price?',
    answer:
      'Similar to other protocols, orders are constructed as dutch auctions, with the allowed execution price slowly decreasing over time, down to a limit (slippage equivalent). Competition between solvers incentivizes them to fill earlier at better prices.',
  },
  {
    question: 'Is Flashbots required?',
    answer:
      'No, but Memswap does work best on chains that support tx bundling (e.g. via Flashbots), because solvers can guarantee that the user’s tx is included first and avoid failed txs if they’re beaten by another solver. ',
  },
  {
    question: 'Is it gasless?',
    answer: (
      <>
        No. In fact, we think “gasless” protocols are overrated:
        <Flex direction="column" css={{ mt: '2' }}>
          <span>
            - For most currencies, still need an initial tx to approve
          </span>
          <span>- Approval must be unlimited to enable gasless</span>
          <span>- Doesn’t work with unwrapped ETH</span>
          <span>- There’s still a gas fee, just abstracted</span>
          <span>- There’s still a gas fee, just abstracted</span>
          <span>- For now at least, most users hold ETH!</span>
        </Flex>
      </>
    ),
  },
  {
    question: 'What happens if the users’ order isn’t filled?',
    answer:
      'If their order was constructed correctly, this should be rare. But in the event it happens, they are left with a balance that can either be withdrawn or used in a subsequent swap.',
  },
]

export const FAQs = () => {
  return (
    <Flex
      direction="column"
      align="center"
      css={{ maxWidth: 700, width: '100%' }}
    >
      <Text style="h4" color="blue">
        FAQ
      </Text>
      <AccordionRoot type="multiple">
        {faqs.map((faq, idx) => (
          <AccordionItem value={`item-${idx}`} key={idx}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </Flex>
  )
}
