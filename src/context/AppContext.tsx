//
// Setting models need to be in a separate context from Zustand to avoid re-rendering errors
//

import { createContext, useContext, useState, ReactNode } from 'react'

interface AppContextType {
  models: string[]
  addModel: (modelUrl: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [models, setModels] = useState<string[]>(["Duck.glb"])
  const addModel = (modelUrl: string) => {
    setModels(prev => [...prev, modelUrl])
  }
  return (
    <AppContext.Provider value={{ models, addModel }}>
      {children}
    </AppContext.Provider>
  )
}

export const useModels = () => { 
  const context = useContext(AppContext)
  if (!context) throw new Error('useModels must be used within an AppProvider')
  return { models: context.models, addModel: context.addModel }
} 