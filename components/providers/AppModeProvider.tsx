import React, {
  FC,
  ReactElement,
  createContext,
  useContext,
  useState,
} from 'react'

type AppModeProviderProps = {
  children: ReactElement
}

type AppModeContextType = {
  dAppModeEnabled: boolean
  toggleDAppMode: () => void
}

const AppModeContext = createContext<AppModeContextType | null>(null)

export const AppModeProvider: FC<AppModeProviderProps> = ({ children }) => {
  const [dAppModeEnabled, setDAppModeEnabled] = useState(false)

  const toggleDAppMode = () => {
    setDAppModeEnabled(!dAppModeEnabled)
  }

  return (
    <AppModeContext.Provider value={{ dAppModeEnabled, toggleDAppMode }}>
      {children}
    </AppModeContext.Provider>
  )
}

export const useAppMode = (): AppModeContextType => {
  const context = useContext(AppModeContext)

  if (!context) {
    throw new Error('useAppMode must be used within an AppModeProvider')
  }

  return context
}
