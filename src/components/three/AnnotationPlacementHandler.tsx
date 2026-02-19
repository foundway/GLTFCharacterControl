import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useAnnotationStore } from '@/store/AnnotationStore'
import { useSceneStore } from '@/store/SceneStore'

const FALLBACK_DISTANCE = 10
const POINTS_THRESHOLD_SCREEN_PX = 1

export const AnnotationPlacementHandler = ({ characterGroupRef }: { characterGroupRef: React.RefObject<THREE.Group | null> }) => {
  const planeRef = useRef<THREE.Mesh>(null)
  const { camera, scene, size } = useThree()
  const { isPlacingAnnotation, add, setPlacing, setOpenInputForId, currentModelUrl } = useAnnotationStore()
  const { stageRadius } = useSceneStore()

  const handlePointerDown = (e: { pointer: THREE.Vector2; stopPropagation: () => void }) => {
    e.stopPropagation()
    if (!currentModelUrl) return
    const raycaster = new THREE.Raycaster()
    const fovRad = 'fov' in camera ? ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180 : Math.PI / 4
    const worldHeightAtDepth = 2 * stageRadius * Math.tan(fovRad / 2)
    const threshold = (POINTS_THRESHOLD_SCREEN_PX / size.height) * worldHeightAtDepth
    raycaster.params.Points = { threshold }
    raycaster.setFromCamera(e.pointer, camera)
    const plane = planeRef.current
    const targets: THREE.Object3D[] = []
    scene.traverse((obj) => {
      if (obj !== plane && obj !== plane?.parent) targets.push(obj)
    })
    const hits = raycaster.intersectObjects(targets, true)
    const first = hits.find((h) => h.point) ?? null
    const worldPoint = first?.point ?? new THREE.Vector3(0, 0, 0).addScaledVector(raycaster.ray.direction, FALLBACK_DISTANCE)
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
