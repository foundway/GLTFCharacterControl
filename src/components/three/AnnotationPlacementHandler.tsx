import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useAnnotationStore } from '@/store/AnnotationStore'
import { useSceneStore } from '@/store/SceneStore'
import { sceneRaycast } from '@/utils/sceneRaycast'

export const AnnotationPlacementHandler = ({
  characterGroupRef,
}: {
  characterGroupRef: React.RefObject<THREE.Group | null>
}) => {
  const planeRef = useRef<THREE.Mesh>(null)
  const { camera, size } = useThree()
  const { isPlacingAnnotation, add, setPlacing, setOpenInputForId, currentModelUrl } = useAnnotationStore()
  const { stageRadius } = useSceneStore()

  const handlePointerDown = (e: { pointer: THREE.Vector2; stopPropagation: () => void }) => {
    e.stopPropagation()
    if (!currentModelUrl) return
    const worldPoint = sceneRaycast(camera, characterGroupRef.current, e.pointer, size, stageRadius)
    if (!worldPoint) return
    const position: [number, number, number] = characterGroupRef.current
      ? (() => {
          const inv = new THREE.Matrix4().copy(characterGroupRef.current!.matrixWorld).invert()
          const local = worldPoint.clone().applyMatrix4(inv)
          return [local.x, local.y, local.z]
        })()
      : [worldPoint.x, worldPoint.y, worldPoint.z]
    const annotation = add(currentModelUrl, { position, text: '' })
    setPlacing(false)
    setOpenInputForId(annotation.id)
  }

  useFrame(() => {
    if (!isPlacingAnnotation || !planeRef.current) return
    const dist = Math.max(stageRadius * 2, 20)
    planeRef.current.position.copy(camera.position).addScaledVector(camera.getWorldDirection(new THREE.Vector3()), dist)
    planeRef.current.lookAt(camera.position)
  })

  if (!isPlacingAnnotation) return null

  const planeSize = 1000

  return (
    <mesh ref={planeRef} onPointerDown={handlePointerDown}>
      <planeGeometry args={[planeSize, planeSize]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}
