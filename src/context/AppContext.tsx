import React, { createContext, useContext, useState, ReactNode } from 'react'

// Scale State
interface AppContextType {
  scale: number
  setScale: (scale: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {

  // Scale state
  const [scale, setScale] = useState(1)

  return (
    <AppContext.Provider value={{ scale, setScale }}>
      {children}
    </AppContext.Provider>
  )
}

export const useScale = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useScale must be used within an AppProvider')
  const { scale, setScale } = context
  return { scale, setScale }
} 