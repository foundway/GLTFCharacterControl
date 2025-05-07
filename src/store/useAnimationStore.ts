import { create } from 'zustand'

interface AnimationState {
  currentAnimation: string
  setCurrentAnimation: (animationName: string) => void
  animations: any[]
  actions: { [key: string]: any }
  setAnimationData: (animations: any[], actions: { [key: string]: any }) => void
}

export const useAnimationStore = create<AnimationState>((set) => ({
  currentAnimation: 'TRACK-idle',
  setCurrentAnimation: (animationName) => {
    set({ currentAnimation: animationName })
    console.log('Animation changing to:', animationName)
  },
  animations: [],
  actions: {},
  setAnimationData: (animations, actions) => set({ animations, actions }),
})) 