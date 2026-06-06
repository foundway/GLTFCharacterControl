import { create } from 'zustand'
import * as THREE from 'three'

const Environments = {
  "Hanger": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/small_hangar_01_2k.hdr',
  "Hall": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/dancing_hall_2k.hdr',
  "Ballroom": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/vestibule_2k.hdr',
  "Field": 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/pretoria_gardens_2k.hdr',
}

interface SceneState {
  showBackground: boolean
  showGrid: boolean
  currentEnvironment: string
  orbitCenter: number
  stageRadius: number
  centeringOffset: THREE.Vector3
  modelSize: THREE.Vector3
  showUISampler: boolean
  pointScale: number
  pointDisplayPercent: number
  cameraNear: number
  orbitTarget: [number, number, number] | null
  setModelSize: (size: THREE.Vector3) => void
  toggleUISampler: () => void
  setCenteringOffset: (offset: THREE.Vector3) => void
  setPointScale: (scale: number) => void
  setPointDisplayPercent: (percent: number) => void
  setCameraNear: (near: number) => void
  setOrbitTarget: (target: [number, number, number] | null) => void
  toggleBackground: () => void
  toggleGrid: () => void
  setEnvironment: (environment: string) => void
  setOrbitCenter: (center: number) => void
  setStageRadius: (radius: number) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  showBackground: true,
  showGrid: false,
  currentEnvironment: Environments["Hanger"],
  orbitCenter: 0.5,
  stageRadius: 1,
  centeringOffset: new THREE.Vector3(0, 0, 0),
  modelSize: new THREE.Vector3(1, 1, 1),
  showUISampler: false,
  pointScale: 1,
  pointDisplayPercent: 100,
  cameraNear: 0.1,
  orbitTarget: null,
  setModelSize: (size) => set({ modelSize: size }),
  toggleUISampler: () => set((state) => ({ showUISampler: !state.showUISampler })),
  setCenteringOffset: (offset) => set({ centeringOffset: offset }),
  setPointScale: (scale) => set({ pointScale: scale }),
  setPointDisplayPercent: (percent) => set({ pointDisplayPercent: percent }),
  setCameraNear: (near) => set({ cameraNear: near }),
  setOrbitTarget: (target) => set({ orbitTarget: target }),
  toggleBackground: () => set((state) => ({ showBackground: !state.showBackground })),
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  setEnvironment: (environment: string) => set({ currentEnvironment: environment }),
  setOrbitCenter: (center) => set({ orbitCenter: center }),
  setStageRadius: (radius) => set({ stageRadius: radius }),
}))

export { Environments } 