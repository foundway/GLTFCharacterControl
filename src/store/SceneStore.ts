import { create } from 'zustand'

const Environments = {
  "Hall": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/dancing_hall_2k.hdr',
  "Hanger": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/small_hangar_01_2k.hdr',
  "Field": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/pretoria_gardens_2k.hdr',
  "Ballroom": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/vestibule_2k.hdr',
}

interface SceneState {
  showBackground: boolean
  showGrid: boolean
  currentEnvironment: string
  orbitCenter: number
  stageRadius: number
  toggleBackground: () => void
  toggleGrid: () => void
  setEnvironment: (environment: string) => void
  setOrbitCenter: (center: number) => void
  setStageRadius: (radius: number) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  showBackground: true,
  showGrid: false,
  currentEnvironment: Environments["Hall"],
  orbitCenter: 0.5,
  stageRadius: 1,
  toggleBackground: () => set((state) => ({ showBackground: !state.showBackground })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setEnvironment: (environment: string) => set({ currentEnvironment: environment }),
  setOrbitCenter: (center) => set({ orbitCenter: center }),
  setStageRadius: (radius) => set({ stageRadius: radius }),
}))

export { Environments } 