import * as SwitchPrimitive from '@radix-ui/react-switch'
import { styled } from '../../styled-system/jsx'

const StyledSwitch = styled(SwitchPrimitive.Root, {
  base: {
    width: 46,
    height: 24,
    backgroundColor: 'gray7',
    borderRadius: '9999px',
    position: 'relative',
    transition: 'background-color 250ms linear',
    '--focusColor': 'colors.gray12',
    _data_state_checked: { backgroundColor: 'primary9' },
  },
})

const Thumb = styled(SwitchPrimitive.Thumb, {
  base: {
    display: 'block',
    width: 21,
    height: 21,
    backgroundColor: 'white',
    borderRadius: '9999px',
    transition: 'transform 100ms',
    transform: 'translateX(2px)',
    willChange: 'transform',
    _data_state_checked: { transform: 'translateX(19px)' },
  },
})

const Switch = (props?: SwitchPrimitive.SwitchProps) => (
  <StyledSwitch {...props}>
    <Thumb />
  </StyledSwitch>
)

export default Switch
