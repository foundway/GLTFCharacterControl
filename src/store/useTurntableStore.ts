import { create } from 'zustand'

interface TurntableState {
  isRotating: boolean
  elevation: number
  toggleRotation: () => void
  setElevation: (value: number) => void
}

export const useTurntableStore = create<TurntableState>((set) => ({
  isRotating: true,
  elevation: 0,
  toggleRotation: () => set((state) => ({ isRotating: !state.isRotating })),
  setElevation: (value) => set({ elevation: value }),
})) 