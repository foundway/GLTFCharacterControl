import { useRef, useCallback, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { useAnnotationStore } from '@/store/AnnotationStore'
import { AnnotationMarkerBadge } from '@/components/ui/AnnotationMarkerBadge'

const OFF_SCREEN_MARGIN = 80

const SingleMarker = ({
  position,
  index,
  onSelect,
}: {
  position: [number, number, number]
  index: number
  onSelect: () => void
}) => {
  const offScreenRef = useRef<{ isOffScreen: boolean; angle: number } | null>(null)
  const [offScreenState, setOffScreenState] = useState<{ isOffScreen: boolean; angle: number } | null>(null)

  useFrame(() => {
    if (offScreenRef.current) {
      setOffScreenState(offScreenRef.current)
    }
  })

  const calculatePosition = useCallback(
    (el: THREE.Object3D, camera: THREE.Camera, size: { width: number; height: number }) => {
      const worldPos = new THREE.Vector3().setFromMatrixPosition(el.matrixWorld)
      worldPos.project(camera)

      let ndcX = worldPos.x
      let ndcY = worldPos.y
      const isBehind = worldPos.z > 1

      if (isBehind) {
        ndcX = -ndcX
        ndcY = -ndcY
      }

      const marginNDCX = (OFF_SCREEN_MARGIN / size.width) * 2
      const marginNDCY = (OFF_SCREEN_MARGIN / size.height) * 2
      const maxNDCX = 1 - marginNDCX
      const maxNDCY = 1 - marginNDCY

      const isOffScreen =
        isBehind || Math.abs(ndcX) > maxNDCX || Math.abs(ndcY) > maxNDCY

      let clampedX = ndcX
      let clampedY = ndcY

      if (isOffScreen) {
        if (Math.abs(ndcX) > maxNDCX) {
          clampedX = ndcX > 0 ? maxNDCX : -maxNDCX
        }
        if (Math.abs(ndcY) > maxNDCY) {
          clampedY = ndcY > 0 ? maxNDCY : -maxNDCY
        }
        const angle = Math.atan2(-ndcY, ndcX)
        offScreenRef.current = { isOffScreen: true, angle }
      } else {
        offScreenRef.current = { isOffScreen: false, angle: 0 }
      }

      const widthHalf = size.width / 2
      const heightHalf = size.height / 2
      const x = clampedX * widthHalf + widthHalf
      const y = -(clampedY * heightHalf) + heightHalf

      return [x, y]
    },
    []
  )

  const offScreen =
    offScreenState?.isOffScreen ? { angleRad: offScreenState.angle } : undefined

  return (
    <Html
      position={position}
      center
      style={{ pointerEvents: 'auto' }}
      zIndexRange={[0, 0]}
      calculatePosition={calculatePosition}
    >
      <AnnotationMarkerBadge index={index} onSelect={onSelect} offScreen={offScreen} />
    </Html>
  )
}

export const AnnotationMarkers = () => {
  const currentModelUrl = useAnnotationStore((s) => s.currentModelUrl)
  const getAnnotations = useAnnotationStore((s) => s.getAnnotations)
  const setOpenViewForId = useAnnotationStore((s) => s.setOpenViewForId)
  const annotations = currentModelUrl ? getAnnotations(currentModelUrl) : []

  if (annotations.length === 0) return null

  return (
    <>
      {annotations.map((ann, i) => (
        <SingleMarker
          key={ann.id}
          position={ann.position}
          index={i + 1}
          onSelect={() => setOpenViewForId(ann.id)}
        />
      ))}
    </>
  )
}
