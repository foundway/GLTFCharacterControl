import { create } from 'zustand'

interface AnimationState {
  currentAnimation: string
  setCurrentAnimation: (animationName: string) => void
  animations: any[]
  setAnimations: (animations: any[]) => void
}

export const useAnimationStore = create<AnimationState>((set) => ({
  currentAnimation: 'TRACK-idle',
  setCurrentAnimation: (animationName) => {
    set({ currentAnimation: animationName })
    console.log('Animation changing to:', animationName)
  },
  animations: [],
  setAnimations: (animations) => set({ animations }),
})) 