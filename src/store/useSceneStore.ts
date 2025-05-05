import { create } from 'zustand'

interface SceneState {
  showEnvironment: boolean
  showGrid: boolean
  toggleEnvironment: () => void
  toggleGrid: () => void
}

export const useSceneStore = create<SceneState>((set) => ({
  showEnvironment: true,
  showGrid: false,
  toggleEnvironment: () => set((state) => ({ showEnvironment: !state.showEnvironment })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
})) 