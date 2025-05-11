import * as THREE from 'three'
import React, { JSX, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useAnimationStore } from '../store/AnimationStore'
import { Handle, HandleTarget } from '@react-three/handle'
import { useModels } from '../context/AppContext'
import { useModelStore } from '../store/ModelStore'

export const Character = (props: JSX.IntrinsicElements['group']) => {  
  const { currentAnimation, setCurrentAnimation, setAnimations } = useAnimationStore()
  const { models } = useModels()
  const { scale } = useModelStore()
  const modelUrl = models[models.length - 1] || 'Duck.glb'
  const { scene, animations } = useGLTF(modelUrl)
  const group = React.useRef<THREE.Group>(null)
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, group)

  useEffect(() => { // Set animation list and play first animation on load
    setAnimations(animations)
    if (animations && animations.length > 0) {
      setCurrentAnimation(animations[0].name)
    } 
  }, [animations, setAnimations, setCurrentAnimation])

  useEffect(() => { // Change animation
    actions[currentAnimation]?.reset().fadeIn(0.5).play()
    return () => {
      actions[currentAnimation]?.fadeOut(0.5)
    }
  }, [currentAnimation])

  return (
    <HandleTarget>
      <group ref={group} {...props} dispose={null} renderOrder={-100} >
        <Handle translate={{ x: true, y: true, z: true }} scale={false} >
          <primitive object={clone} scale={scale} userData={{ isCharacter: true }}/>
        </Handle>
      </group>
    </HandleTarget>
  )
}