//
// Setting models need to be in a separate context from Zustand to avoid re-rendering errors
//

import { createContext, useContext, useState, ReactNode } from 'react'

interface ModelItem {
  name: string
  url: string
}

const Models: ModelItem[] = [
  { name: "Ship In A Bottle", url: 'ship-in-a-bottle-optimized.glb' },
  { name: "Mosquito In Amber", url: 'mosquito-in-amber-optimized.glb' },
  { name: "Gelatinous Cube", url: 'gelatinous-cube-optimized.glb' },
  { name: "Terrarium Bot A", url: 'terrarium-bot-a-optimized.glb' },
  { name: "Terrarium Bot B", url: 'terrarium-bot-b-optimized.glb' },
  { name: "Walking Woman", url: 'woman-walking-optimized.glb' },
]

interface AppContextType {
  models: ModelItem[]
  currentModel: ModelItem
  setCurrentModel: (model: ModelItem) => void
  addModel: (model: ModelItem) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [models, setModels] = useState<ModelItem[]>(Models)
  const [currentModel, setCurrentModel] = useState<ModelItem>(Models[0])
  const addModel = (model: ModelItem) => {
    setModels(prev => [...prev, model])
    setCurrentModel(model)
  }
  return (
    <AppContext.Provider value={{ models, currentModel, setCurrentModel, addModel }}>
      {children}
    </AppContext.Provider>
  )
}

export const useModels = () => { 
  const context = useContext(AppContext)
  if (!context) throw new Error('useModels must be used within an AppProvider')
  return context
} 