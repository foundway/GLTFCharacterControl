import * as THREE from 'three'
import React, { JSX, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'
import { useAnimationStore } from '../store/AnimationStore'
import { Handle, HandleTarget } from '@react-three/handle'
import { useModels } from '../context/AppContext'
import { useModelStore } from '../store/ModelStore'
import { useThree } from '@react-three/fiber'
import { useSceneStore } from '@/store/SceneStore'

export const Character = (props: JSX.IntrinsicElements['group']) => {  
  const { currentAnimation, setCurrentAnimation, setAnimations } = useAnimationStore()
  const { models } = useModels()
  const { scale } = useModelStore()
  const { setOrbitCenter, setStageRadius } = useSceneStore()
  const modelUrl = models[models.length - 1]
  const { scene, animations } = useGLTF(modelUrl)
  const group = React.useRef<THREE.Group>(null)
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { actions } = useAnimations(animations, group)
  const { camera } = useThree()

  useEffect(() => { 
    if (!scene) return
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const radius = Math.max(size.x, size.z)
    const center = box.getCenter(new THREE.Vector3())
    setOrbitCenter(center.y)
    setStageRadius(radius * 2)
  }, [scene, camera])

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