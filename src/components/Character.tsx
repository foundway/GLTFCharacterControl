import * as THREE from 'three'
import React, { JSX, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useAnimationStore } from '../store/useAnimationStore'
import { useModelStore } from '../store/useModelStore'
import { Handle, HandleTarget } from '@react-three/handle'

export const Character = (props: JSX.IntrinsicElements['group']) => {  
  const { currentAnimation, setCurrentAnimation, setAnimations } = useAnimationStore()
  const { models } = useModelStore()
  const modelUrl = models[models.length - 1] || 'Duck.glb'
  const { scene, animations } = useGLTF(modelUrl)
  const group = React.useRef<THREE.Group>(null)
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    actions[currentAnimation]?.reset().fadeIn(0.5).play()
    return () => {
      actions[currentAnimation]?.fadeOut(0.5)
    }
  }, [currentAnimation])

  useEffect(() => {
    if (animations && animations.length > 0) {
      setCurrentAnimation(animations[0].name)
    } 
  }, [animations, setCurrentAnimation])

  useEffect(() => {
    setAnimations(animations)
  }, [animations, setAnimations])

  return (
    <HandleTarget>
      <group ref={group} {...props} dispose={null} renderOrder={-100}>
        <Handle translate={{ x: true, y: true, z: true }} scale={false} >
          <primitive object={clone} />
        </Handle>
      </group>
    </HandleTarget>
  )
}