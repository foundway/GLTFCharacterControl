import { create } from 'zustand'

interface ModelState {
  scale: number
  setScale: (scale: number) => void
}

export const useModelStore = create<ModelState>((set) => ({
  scale: 1,
  setScale: (scale: number) => {
    console.log('setting scale', scale)
    set({ scale })
  }
})) 