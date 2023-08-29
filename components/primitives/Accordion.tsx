import { forwardRef, ComponentPropsWithoutRef, ElementRef } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { styled } from '../../styled-system/jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box } from './'

const StyledHeader = styled(Accordion.Header, {
  base: {
    display: 'flex',
    fontSize: '16px',
    fontWeight: 700,
    color: 'gray12',
  },
})

const StyledTrigger = styled(Accordion.Trigger, {
  base: {
    width: '100%',
    cursor: 'pointer',
    fontFamily: 'body',
    backgroundColor: 'transparent',
    padding: '0 20px',
    height: 52,
    flex: 1,
    gap: '2',
    display: 'flex',
    textAlign: 'left',
    alignItems: 'center',
    justifyContent: 'space-between',
    lineHeight: 1,
    _hover: { backgroundColor: 'gray3' },
  },
})

const StyledContent = styled(Accordion.Content, {
  base: {
    overflow: 'hidden',
    fontSize: 14,
    color: 'gray12',
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
  },
})

const AccordionItem = styled(Accordion.Item, {
  base: {
    overflow: 'hidden',
    '--borderColor': 'colors.gray6',
    borderBottom: '1px solid var(--borderColor)',
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
