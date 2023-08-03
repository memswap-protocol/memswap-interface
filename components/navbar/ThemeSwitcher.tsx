import { useTheme } from 'next-themes'
import { Box, Button } from '../primitives'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Box>
      <Button
        type="button"
        color="ghost"
        size="small"
        onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
      >
        {theme == 'dark' ? (
          <FontAwesomeIcon icon={faMoon} width={16} height={16} />
        ) : (
          <FontAwesomeIcon icon={faSun} width={16} height={16} />
        )}
      </Button>
    </Box>
  )
}

export default ThemeSwitcher
