import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ScaleContextType {
  scale: number
  setScale: (scale: number) => void
}

const ScaleContext = createContext<ScaleContextType | undefined>(undefined)

export const ScaleProvider = ({ children }: { children: ReactNode }) => {
  const [scale, setScale] = useState(1)

  return (
    <ScaleContext.Provider value={{ scale, setScale }}>
      {children}
    </ScaleContext.Provider>
  )
}

export const useScale = () => {
  const context = useContext(ScaleContext)
  if (context === undefined) {
    throw new Error('useScale must be used within a ScaleProvider')
  }
  return context
} 