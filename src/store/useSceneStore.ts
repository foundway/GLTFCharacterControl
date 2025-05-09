import { create } from 'zustand'

interface SceneState {
  showBackground: boolean
  showGrid: boolean
  currentEnvironment: string
  toggleBackground: () => void
  toggleGrid: () => void
  setEnvironment: (environment: string) => void
}

const Environments = {
  "Hall": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/dancing_hall_2k.hdr',
  "Airport": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rostock_laage_airport_2k.hdr',
  "Hanger": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/small_hangar_01_2k.hdr',
  "Garden": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/pretoria_gardens_2k.hdr',
  "Sunset": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/bambanani_sunset_2k.hdr',
  "Ballroom": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/vestibule_2k.hdr',
}

export const useSceneStore = create<SceneState>((set) => ({
  showBackground: true,
  showGrid: false,
  currentEnvironment: Environments["Hall"],
  toggleBackground: () => set((state) => ({ showBackground: !state.showBackground })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setEnvironment: (environment: string) => set({ currentEnvironment: environment }),
}))

export { Environments } 