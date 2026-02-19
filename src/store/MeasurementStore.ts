import { create } from 'zustand'
import * as THREE from 'three'

interface MeasurementStore {
  isMeasurementMode: boolean
  points: THREE.Vector3[]
  chainStarts: number[]
  previewPoint: THREE.Vector3 | null
  placementEnded: boolean
  setMeasurementMode: (on: boolean) => void
  addPoint: (worldPos: THREE.Vector3) => void
  addChainStart: (index: number) => void
  setPreviewPoint: (pos: THREE.Vector3 | null) => void
  setPlacementEnded: (ended: boolean) => void
  clearPoints: () => void
  endChain: () => void
  removeOrphanLastPoint: () => boolean
}

export const useMeasurementStore = create<MeasurementStore>((set, get) => ({
  isMeasurementMode: false,
  points: [],
  chainStarts: [],
  previewPoint: null,
  placementEnded: false,

  setMeasurementMode: (on) => {
    set({ isMeasurementMode: on })
    if (!on) get().clearPoints()
  },

  addPoint: (worldPos) => {
    set((state) => {
      const wasEmpty = state.points.length === 0
      const nextPoints = [...state.points, worldPos.clone()]
      const nextChainStarts = wasEmpty ? [0] : state.chainStarts
      return { points: nextPoints, chainStarts: nextChainStarts }
    })
  },

  addChainStart: (index) => {
    set((state) => ({
      chainStarts: [...state.chainStarts, index],
    }))
  },

  setPreviewPoint: (pos) => {
    set({ previewPoint: pos })
  },

  setPlacementEnded: (ended) => {
    set({ placementEnded: ended })
  },

  clearPoints: () => {
    set({ points: [], chainStarts: [], previewPoint: null, placementEnded: false })
  },

  endChain: () => {
    set({ points: [], chainStarts: [], previewPoint: null, placementEnded: false })
  },

  removeOrphanLastPoint: () => {
    const state = get()
    if (state.points.length === 0) return false
    const lastChainStart = state.chainStarts[state.chainStarts.length - 1]
    const lastPointIsOrphan = lastChainStart === state.points.length - 1
    if (!lastPointIsOrphan) return false
    set({
      points: state.points.slice(0, -1),
      chainStarts: state.chainStarts.slice(0, -1),
      previewPoint: null,
      placementEnded: state.points.length === 1 ? false : true,
    })
    return true
  },
}))
