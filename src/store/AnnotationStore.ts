import { create } from 'zustand'

const STORAGE_KEY = 'gltf-annotations'

export interface Annotation {
  id: string
  position: [number, number, number]
  text: string
}

interface AnnotationStore {
  annotationsByModel: Record<string, Annotation[]>
  isPlacingAnnotation: boolean
  openInputForId: string | null
  openViewForId: string | null
  flyToAnnotationId: string | null
  currentModelUrl: string | null
  load: () => void
  save: () => void
  getAnnotations: (modelUrl: string) => Annotation[]
  add: (modelUrl: string, annotation: Omit<Annotation, 'id'>) => Annotation
  update: (modelUrl: string, id: string, text: string) => void
  remove: (modelUrl: string, id: string) => void
  setPlacing: (v: boolean) => void
  setOpenInputForId: (id: string | null) => void
  setOpenViewForId: (id: string | null) => void
  setFlyToAnnotationId: (id: string | null) => void
  setCurrentModelUrl: (url: string | null) => void
}

function generateId() {
  return `ann-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useAnnotationStore = create<AnnotationStore>((set, get) => ({
  annotationsByModel: {},
  isPlacingAnnotation: false,
  openInputForId: null,
  openViewForId: null,
  flyToAnnotationId: null,
  currentModelUrl: null,

  load: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const data = JSON.parse(raw) as Record<string, Annotation[]>
        set({ annotationsByModel: data })
      }
    } catch {
      set({ annotationsByModel: {} })
    }
  },

  save: () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(get().annotationsByModel))
    } catch {
      // ignore
    }
  },

  getAnnotations: (modelUrl: string) => {
    return get().annotationsByModel[modelUrl] ?? []
  },

  add: (modelUrl: string, annotation: Omit<Annotation, 'id'>) => {
    const id = generateId()
    const full: Annotation = { ...annotation, id }
    set((state) => ({
      annotationsByModel: {
        ...state.annotationsByModel,
        [modelUrl]: [...(state.annotationsByModel[modelUrl] ?? []), full],
      },
    }))
    get().save()
    return full
  },

  update: (modelUrl: string, id: string, text: string) => {
    set((state) => {
      const list = state.annotationsByModel[modelUrl] ?? []
      const next = list.map((a) => (a.id === id ? { ...a, text } : a))
      return {
        annotationsByModel: { ...state.annotationsByModel, [modelUrl]: next },
      }
    })
    get().save()
  },

  remove: (modelUrl: string, id: string) => {
    set((state) => {
      const list = (state.annotationsByModel[modelUrl] ?? []).filter((a) => a.id !== id)
      return {
        annotationsByModel: { ...state.annotationsByModel, [modelUrl]: list },
        openViewForId: state.openViewForId === id ? null : state.openViewForId,
      }
    })
    get().save()
  },

  setPlacing: (v) => set({ isPlacingAnnotation: v }),
  setOpenInputForId: (id) => set({ openInputForId: id }),
  setOpenViewForId: (id) => set({ openViewForId: id }),
  setFlyToAnnotationId: (id) => set({ flyToAnnotationId: id }),
  setCurrentModelUrl: (url) => set({ currentModelUrl: url }),
}))
