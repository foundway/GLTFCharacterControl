import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import React, { JSX, useEffect, forwardRef } from 'react'
import { Handle, HandleTarget } from '@react-three/handle'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useModels } from '@/context/AppContext'
import { useModelStore } from '@/store/ModelStore'
import { useSceneStore } from '@/store/SceneStore'
import { useAnimationStore } from '@/store/AnimationStore'
import { parseAssetMetadata } from '@/utils/gltfMetadata'
import { AnnotationMarkers } from '@/components/three/AnnotationMarkers'
import { UISampler } from '@/components/three/UISampler'

export const Character = forwardRef<THREE.Group, JSX.IntrinsicElements['group']>((props, ref) => {  
  const { currentAnimation, setCurrentAnimation, setAnimations } = useAnimationStore()
  const { scale, isMenuVisible } = useModelStore()
  const { centeringOffset, setOrbitCenter, setStageRadius, setCenteringOffset, setModelSize, pointScale, pointDisplayPercent } = useSceneStore()
  const { currentModel, setLoadedMetadata } = useModels()
  const modelUrl = currentModel.url
  const gltf = useGLTF(modelUrl)
  const { scene, animations } = gltf
  const group = React.useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, group)
  const UNSET_ROUGHNESS = 1
  const UNSET_THICKNESS = 0
  const FALLBACK_ROUGHNESS = 0.1 
  const FALLBACK_THICKNESS = 1

  const clone = React.useMemo(() => {
    const cloned = SkeletonUtils.clone(scene)
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhysicalMaterial && child.material.transmission > 0) {
        child.material.transparent = false
        if (child.material.roughness == UNSET_ROUGHNESS) { // roughness need to be lower than 1
          child.material.roughness = FALLBACK_ROUGHNESS
        }
        if (child.material.thickness == UNSET_THICKNESS) { // roughness need to be higher than 0
          child.material.thickness = FALLBACK_THICKNESS
        }
        child.material.side = THREE.FrontSide
      } 
    })
    return cloned
  }, [scene])

  useEffect(() => {
    const meta = parseAssetMetadata(gltf.asset as Parameters<typeof parseAssetMetadata>[0])
    setLoadedMetadata(modelUrl, meta)
  }, [modelUrl, gltf.asset, setLoadedMetadata])

  useEffect(() => { 
    if (!scene) return
    const box = new THREE.Box3().setFromObject(scene)
    const size = box.getSize(new THREE.Vector3())
    const radius = Math.max(Math.max(size.x, size.y), size.z)
    const center = box.getCenter(new THREE.Vector3())
    const min = box.min
    setCenteringOffset(new THREE.Vector3(-center.x, -min.y, -center.z))
    setOrbitCenter(size.y/2)
    setStageRadius(radius)
    setModelSize(size)
  }, [scene])

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

  useEffect(() => {
    clone.traverse((child) => {
      if (child instanceof THREE.Points && child.material instanceof THREE.PointsMaterial) {
        child.material.size = pointScale
        const geom = child.geometry
        if (geom?.attributes?.position) {
          const total = geom.attributes.position.count
          const count = pointDisplayPercent >= 100 ? total : Math.max(1, Math.floor((total * pointDisplayPercent) / 100))
          geom.setDrawRange(0, count)
        }
      }
    })
  }, [clone, pointScale, pointDisplayPercent])

  return (
    <HandleTarget>
      <group scale={scale} rotation-y={0.6} {...props} dispose={null}>
        <Handle translate={{ x: true, y: true, z: true }} scale={false} bind={!isMenuVisible}>
          <group ref={(el) => { group.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el }}>
            <primitive object={clone} position={centeringOffset} userData={{ isCharacter: true }} />
            <AnnotationMarkers />
            <UISampler />
          </group>
        </Handle>
      </group>
    </HandleTarget>
  )
})