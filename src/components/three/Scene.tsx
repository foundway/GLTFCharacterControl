import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useXR, XROrigin } from '@react-three/xr'
import { Character } from '@/components/three/Character'
import { Environment } from '@/components/three/Environment'
import { MainMenu } from '@/components/ui/MainMenu'
import { AnnotationPlacementHandler } from '@/components/three/AnnotationPlacementHandler'
import { useSceneStore } from '@/store/SceneStore'
import { useAnnotationStore } from '@/store/AnnotationStore'

const ANNOTATION_FOCUS_DISTANCE = 4

const Scene = () => {
  const { showGrid, orbitCenter, stageRadius, cameraNear, orbitTarget, setOrbitTarget } = useSceneStore()
  const { getAnnotations, currentModelUrl, flyToAnnotationId, setFlyToAnnotationId } = useAnnotationStore()
  const { camera } = useThree()
  const { session } = useXR()
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const characterGroupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    camera.position.z = stageRadius * 1.5
    camera.position.y = orbitCenter * 1.333
    camera.updateProjectionMatrix()
  }, [stageRadius, camera])

  useEffect(() => {
    camera.near = cameraNear
    camera.updateProjectionMatrix()
  }, [camera, cameraNear])

  useEffect(() => {
    if (!orbitTarget || !controlsRef.current) return
    const targetVec = new THREE.Vector3(...orbitTarget)
    controlsRef.current.target.copy(targetVec)
    const direction = camera.position.clone().sub(targetVec).normalize()
    if (direction.lengthSq() > 0) {
      camera.position.copy(targetVec).addScaledVector(direction, ANNOTATION_FOCUS_DISTANCE)
    }
    controlsRef.current.update()
    setOrbitTarget(null)
  }, [orbitTarget, setOrbitTarget, camera])

  useEffect(() => {
    if (!flyToAnnotationId || !characterGroupRef.current || !currentModelUrl) return
    const annotations = getAnnotations(currentModelUrl)
    const ann = annotations.find((a) => a.id === flyToAnnotationId)
    if (!ann) return
    const worldPos = new THREE.Vector3(...ann.position).applyMatrix4(characterGroupRef.current.matrixWorld)
    setOrbitTarget([worldPos.x, worldPos.y, worldPos.z])
    setFlyToAnnotationId(null)
  }, [flyToAnnotationId, currentModelUrl, getAnnotations, setOrbitTarget, setFlyToAnnotationId])

  return (
    <>
      <color attach="background" args={['#1a1a1a']} />
      <Environment />
      <Character ref={characterGroupRef} />
      <AnnotationPlacementHandler characterGroupRef={characterGroupRef} />
      {!session && <OrbitControls ref={controlsRef} target={[0, orbitCenter, 0]} />}
      {showGrid && (
        <Grid
          position={[0, 0, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={1}
          cellColor="#eee"
          sectionSize={100}
          sectionThickness={1}
          sectionColor="#944"
          fadeDistance={3}
          renderOrder={-1}
        />
      )}
      <XROrigin position={[0, 0, stageRadius]} >
        <MainMenu />
      </XROrigin>
    </>
  )
}

export default Scene 