import { Flex, Text } from '../primitives'
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from '../primitives/Accordion'

const faqs = [
  {
    question: 'Is MemSwap permissionless?',
    answer:
      'The protocol uses the ethereum mempool for propagation of swap intents, meaning no permissioned or opaque orderbook is required.',
  },
  {
    question: 'Is MemSwap permissionless?',
    answer:
      'The protocol uses the ethereum mempool for propagation of swap intents, meaning no permissioned or opaque orderbook is required.',
  },
  {
    question: 'Is MemSwap permissionless?',
    answer:
      'The protocol uses the ethereum mempool for propagation of swap intents, meaning no permissioned or opaque orderbook is required.',
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
