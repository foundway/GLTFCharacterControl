import { create } from 'zustand'

interface ModelState {
  models: string[]
  addModel: (modelUrl: string) => void
}

export const useModelStore = create<ModelState>((set) => ({
  models: [],
  addModel: (modelUrl: string) => {
    set((state) => ({
      models: [...state.models, modelUrl]
    }))
  }
})) 