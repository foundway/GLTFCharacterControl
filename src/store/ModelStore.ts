import { create } from 'zustand'

interface ModelStore {
  scale: number
  setScale: (scale: number) => void

}

export const useModelStore = create<ModelStore>((set) => ({
  scale: 1,
  setScale: (scale) => set({ scale }),

})) 