import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useMeasurementStore } from '@/store/MeasurementStore'
import { useSceneStore } from '@/store/SceneStore'
import { sceneRaycast } from '@/utils/sceneRaycast'

const PLANE_SIZE = 1000
const CLICK_THRESHOLD_PX = 5

export const MeasurementPlacementHandler = ({
  characterGroupRef,
}: {
  characterGroupRef: React.RefObject<THREE.Group | null>
}) => {
  const planeRef = useRef<THREE.Mesh>(null)
  const pointerDownRef = useRef<{ x: number; y: number; dragging: boolean } | null>(null)
  const placementEndedRef = useRef(false)
  const { camera, size } = useThree()
  const { stageRadius } = useSceneStore()
  const {
    isMeasurementMode,
    points,
    addPoint,
    addChainStart,
    setPreviewPoint,
    setPlacementEnded,
    removeOrphanLastPoint,
  } = useMeasurementStore()

  useEffect(() => {
    if (!isMeasurementMode) {
      placementEndedRef.current = false
      setPlacementEnded(false)
    }
  }, [isMeasurementMode, setPlacementEnded])

  const pixelDistance = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = (b.x - a.x) * (size.width / 2)
    const dy = (b.y - a.y) * (size.height / 2)
    return Math.sqrt(dx * dx + dy * dy)
  }

  const handlePointerDown = (e: { pointer: THREE.Vector2; stopPropagation: () => void }) => {
    pointerDownRef.current = { x: e.pointer.x, y: e.pointer.y, dragging: false }
  }

  const handlePointerMove = (e: { pointer: THREE.Vector2 }) => {
    if (pointerDownRef.current) {
      const dist = pixelDistance(
        { x: pointerDownRef.current.x, y: pointerDownRef.current.y },
        { x: e.pointer.x, y: e.pointer.y }
      )
      if (dist > CLICK_THRESHOLD_PX) pointerDownRef.current.dragging = true
      return
    }
    const worldPoint = sceneRaycast(camera, characterGroupRef.current, e.pointer, size, stageRadius)
    setPreviewPoint(worldPoint ?? null)
  }

  const handlePointerUp = (e: { pointer: THREE.Vector2; stopPropagation: () => void }) => {
    const down = pointerDownRef.current
    pointerDownRef.current = null
    if (!down || down.dragging) return
    e.stopPropagation()
    const worldPoint = sceneRaycast(camera, characterGroupRef.current, e.pointer, size, stageRadius)
    if (!worldPoint) {
      if (points.length >= 1) {
        const removed = removeOrphanLastPoint()
        if (removed) {
          placementEndedRef.current = useMeasurementStore.getState().placementEnded
        } else {
          setPreviewPoint(null)
          placementEndedRef.current = true
          setPlacementEnded(true)
        }
      }
      return
    }
    const wasPlacementEnded = placementEndedRef.current
    if (wasPlacementEnded) {
      placementEndedRef.current = false
      setPlacementEnded(false)
    }
    addPoint(worldPoint.clone())
    if (wasPlacementEnded) {
      addChainStart(useMeasurementStore.getState().points.length - 1)
    }
  }

  useFrame(() => {
    if (!isMeasurementMode || !planeRef.current) return
    const dist = Math.max(stageRadius * 2, 20)
    planeRef.current.position
      .copy(camera.position)
      .addScaledVector(camera.getWorldDirection(new THREE.Vector3()), dist)
    planeRef.current.lookAt(camera.position)
  })

  if (!isMeasurementMode) return null

  return (
    <mesh
      ref={planeRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}
