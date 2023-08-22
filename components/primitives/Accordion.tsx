import { forwardRef, ComponentPropsWithoutRef, ElementRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { styled } from '../../styled-system/jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box } from './'

import { violet, blackA, mauve } from '@radix-ui/colors'

const StyledHeader = styled(Accordion.Header, {
  base: {
    display: 'flex',
  },
})

const StyledTrigger = styled(Accordion.Trigger, {
  base: {
    width: '100%',
    fontFamily: 'inherit',
    backgroundColor: 'transparent',
    padding: '0 20px',
    height: 45,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 15,
    lineHeight: 1,
    color: violet.violet11,
    boxShadow: `0 1px 0 ${mauve.mauve6}`,
    _hover: { backgroundColor: 'gray3' },
  },
})

const StyledContent = styled(Accordion.Content, {
  base: {
    overflow: 'hidden',
    fontSize: 15,
    color: mauve.mauve11,
    backgroundColor: mauve.mauve2,
    _data_state_open: {
      animation: `slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
    },
    _data_state_closed: {
      animation: `slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
    },
  },
})

const StyledContentText = styled('div', {
  base: {
    padding: '15px 20px',
  },
})

const AccordionRoot = styled(Accordion.Root, {
  base: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: mauve.mauve6,
    boxShadow: `0 2px 10px ${blackA.blackA4}`,
  },
})

const AccordionItem = styled(Accordion.Item, {
  base: {
    overflow: 'hidden',
    marginTop: 1,
    borderRadius: 8,

    // '&:first-child': {
    //   marginTop: 0,
    //   borderTopLeftRadius: 4,
    //   borderTopRightRadius: 4,
    // },

    // '&:last-child': {
    //   borderBottomLeftRadius: 4,
    //   borderBottomRightRadius: 4,
    // },

    // '&:focus-within': {
    //   position: 'relative',
    //   zIndex: 1,
    //   boxShadow: `0 0 0 2px ${mauve.mauve12}`,
    // },
  },
})

const AccordionTrigger = forwardRef<
  ElementRef<typeof StyledTrigger>,
  ComponentPropsWithoutRef<typeof StyledTrigger>
>(({ children, ...props }, forwardedRef) => (
  <StyledHeader>
    <StyledTrigger {...props} ref={forwardedRef}>
      {children}
      <Box
        css={{
          transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)',
          _data_state_open_child: { transform: 'rotate(180deg)' },
          color: 'gray10',
        }}
      >
        <FontAwesomeIcon icon={faChevronDown} />
      </Box>
    </StyledTrigger>
  </StyledHeader>
))

AccordionTrigger.displayName = 'Accordion Trigger'

const AccordionContent = forwardRef<
  ElementRef<typeof StyledContent>,
  ComponentPropsWithoutRef<typeof StyledContent>
>(({ children, ...props }, forwardedRef) => (
  <StyledContent {...props} ref={forwardedRef}>
    <StyledContentText>{children}</StyledContentText>
  </StyledContent>
))

AccordionContent.displayName = 'Accordion Content'

export { AccordionItem, AccordionContent, AccordionTrigger, AccordionRoot }
