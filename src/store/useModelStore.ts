import { create } from 'zustand'

interface ModelState {
  models: string[]
  scale: number
  addModel: (modelUrl: string) => void
  setScale: (scale: number) => void
}

export const useModelStore = create<ModelState>((set) => ({
  models: [],
  scale: 1,
  addModel: (modelUrl: string) => {
    set((state) => ({
      models: [...state.models, modelUrl]
    }))
  },
  setScale: (scale: number) => {
    console.log('setting scale', scale)
    set({ scale })
  }
})) 