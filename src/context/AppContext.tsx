import { createContext, useContext, useState, ReactNode } from 'react'

interface AppContextType {
  scale: number
  setScale: (scale: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [scale, setScale] = useState(1)
  return (
    <AppContext.Provider value={{ scale, setScale }}>
      {children}
    </AppContext.Provider>
  )
}

export const useScale = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useScale must be used within an AppContextProvider')
  }
  return context
} 