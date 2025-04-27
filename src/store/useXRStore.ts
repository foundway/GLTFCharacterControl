import { create } from 'zustand'

interface XRState {
  isXR: boolean
  toggleXR: () => void
}

export const useXRStore = create<XRState>((set) => ({
  isXR: false,
  toggleXR: () => set((state) => ({ isXR: !state.isXR })),
})) 