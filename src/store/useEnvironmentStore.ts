import { create } from 'zustand'

interface EnvironmentState {
  showEnvironment: boolean
  toggleEnvironment: () => void
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  showEnvironment: false,
  toggleEnvironment: () => set((state) => ({ showEnvironment: !state.showEnvironment })),
})) 