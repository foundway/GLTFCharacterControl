//
// Setting models need to be in a separate context from Zustand to avoid re-rendering errors
//

import { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import type { ModelMetadata } from '@/utils/gltfMetadata'

export interface ModelItem {
  name: string
  url: string
  author: string
  authorURL: string
  license: string
  licenseURL: string
}

const Models: ModelItem[] = [
  { name: "Ship In A Bottle", url: 'ship-in-a-bottle-optimized.glb', author: 'Loïc Norgeot', authorURL: 'https://sketchfab.com/norgeotloic', license: 'CC BY-NC 4.0', licenseURL: 'https://creativecommons.org/licenses/by-nc/4.0/' },
  { name: "Mosquito In Amber", url: 'mosquito-in-amber-optimized.glb', author: 'Loïc Norgeot', authorURL: 'https://sketchfab.com/norgeotloic', license: 'CC BY-NC 4.0', licenseURL: 'https://creativecommons.org/licenses/by-nc/4.0/'  },
  { name: "Mercedes Benz 300SL Gullwing", url: 'mercedes-benz-300sl-gullwing-optimized.glb', author: 'vecarz.com', authorURL: 'https://sketchfab.com/heynic', license: 'CC BY 4.0', licenseURL: 'https://creativecommons.org/licenses/by/4.0/'  },
  { name: "Gelatinous Cube", url: 'gelatinous-cube-optimized.glb', author: 'glenatron', authorURL: 'https://sketchfab.com/glenatron', license: 'CC BY-NC 4.0', licenseURL: 'https://creativecommons.org/licenses/by-nc/4.0/' },
  { name: "Terrarium Bot A", url: 'terrarium-bot-a-optimized.glb', author: 'N01516', authorURL: 'https://sketchfab.com/N01506', license: 'CC BY-NC 4.0', licenseURL: 'https://creativecommons.org/licenses/by-nc/4.0/'},
  { name: "Terrarium Bot B", url: 'terrarium-bot-b-optimized.glb', author: 'N01516', authorURL: 'https://sketchfab.com/N01506', license: 'CC BY-NC 4.0', licenseURL: 'https://creativecommons.org/licenses/by-nc/4.0/' },
  { name: "Woman Walking", url: 'woman-walking-optimized.glb', author: ' Arion Digital', authorURL: 'https://sketchfab.com/andrewswihart', license: 'CC BY 4.0', licenseURL: 'https://creativecommons.org/licenses/by/4.0/' },
  { name: "Cesium Man", url: 'cesium-man.glb', author: 'Cesium', authorURL: 'https://github.com/KhronosGroup/glTF-Sample-Assets/blob/main/Models/CesiumMan/README.md', license: 'CC BY-NC 4.0', licenseURL: 'https://creativecommons.org/licenses/by-nc/4.0/'},
  { name: "Duck", url: 'duck.glb', author: 'Sony', authorURL: 'https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Duck', license: 'SCEA Shared Source License, Version 1.0', licenseURL: 'https://spdx.org/licenses/SCEA.html' },
  { name: "Back Alley (Point Cloud)", url: 'lane.glb', author: 'BirdChen', authorURL: 'https://sketchfab.com/bird219', license: 'CC BY 4.0', licenseURL: 'https://creativecommons.org/licenses/by/4.0/' },
  { name: "Hotel Room (Point Cloud)", url: 'color_point_cloud_-_nyc_hotel_room.glb', author: 'Kaarta', authorURL: 'https://sketchfab.com/kaarta', license: 'CC BY 4.0', licenseURL: 'https://creativecommons.org/licenses/by/4.0/' },
  { name: "Hintze Hall (Point Cloud)", url: 'hintze_hall_nhm_london_point_cloud.glb', author: 'Thomas Flynn', authorURL: 'https://sketchfab.com/nebulousflynn', license: 'CC BY-NC 4.0', licenseURL: 'https://creativecommons.org/licenses/by-nc/4.0/' },
]

type LoadedMetadata = Record<string, ModelMetadata>

interface AppContextType {
  models: ModelItem[]
  currentModel: ModelItem
  displayModel: ModelItem
  setCurrentModel: (model: ModelItem) => void
  setLoadedMetadata: (url: string, meta: ModelMetadata | null) => void
  addModel: (model: ModelItem) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [models, setModels] = useState<ModelItem[]>(Models)
  const [currentModel, setCurrentModel] = useState<ModelItem>(Models[0])
  const [loadedMetadata, setLoadedMetadataState] = useState<LoadedMetadata>({})

  const displayModel = useMemo(() => {
    const meta = loadedMetadata[currentModel.url]
    if (!meta) return currentModel
    return {
      ...currentModel,
      author: meta.author ?? currentModel.author,
      authorURL: meta.authorURL ?? currentModel.authorURL,
      license: meta.license ?? currentModel.license,
      licenseURL: meta.licenseURL ?? currentModel.licenseURL,
    }
  }, [currentModel, loadedMetadata])

  const setLoadedMetadata = (url: string, meta: ModelMetadata | null) => {
    setLoadedMetadataState(prev => (meta ? { ...prev, [url]: meta } : (() => { const { [url]: _, ...rest } = prev; return rest })()))
  }

  const addModel = (model: ModelItem) => {
    setModels(prev => [...prev, model])
    setCurrentModel(model)
  }

  return (
    <AppContext.Provider value={{ models, currentModel, displayModel, setCurrentModel, setLoadedMetadata, addModel }}>
      {children}
    </AppContext.Provider>
  )
}

export const useModels = () => { 
  const context = useContext(AppContext)
  if (!context) throw new Error('useModels must be used within an AppProvider')
  return context
} 