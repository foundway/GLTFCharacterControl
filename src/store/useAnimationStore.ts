import { create } from 'zustand'

interface AnimationState {
  currentAnimation: string
  setCurrentAnimation: (animationName: string) => void
}

export const useAnimationStore = create<AnimationState>((set) => ({
  currentAnimation: 'TRACK-idle',
  setCurrentAnimation: (animationName: string) => {
    set({ currentAnimation: animationName })
    console.log('Animation changing to:', animationName)
  },
})) 