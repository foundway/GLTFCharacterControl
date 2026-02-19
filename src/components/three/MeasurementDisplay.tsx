import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { useMeasurementStore } from '@/store/MeasurementStore'
import { worldSizeAtDepth } from '@/utils/sceneRaycast'

const POINT_PX = 8
const LINE_PX = 2
const MEASUREMENT_RENDER_ORDER = 10000

const Segment = ({
  from,
  to,
  showLabel,
}: {
  from: THREE.Vector3
  to: THREE.Vector3
  showLabel: boolean
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, size } = useThree()
  const length = from.distanceTo(to)
  const midpoint = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5)
  const dir = new THREE.Vector3().subVectors(to, from).normalize()

  useFrame(() => {
    if (!meshRef.current) return
    const camDist = camera.position.distanceTo(midpoint)
    const radiusScale = worldSizeAtDepth(camera, size, camDist, LINE_PX)
    meshRef.current.scale.set(radiusScale, 1, radiusScale)
  })

  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir
  )

  return (
    <group position={midpoint} quaternion={quat}>
      <mesh ref={meshRef} renderOrder={MEASUREMENT_RENDER_ORDER}>
        <cylinderGeometry args={[1, 1, length, 8]} />
        <meshBasicMaterial
          color="white"
          transparent
          opacity={1}
          depthTest={false}
          depthWrite={false}
        />
      </mesh>
      {showLabel && (
        <Html position={[0, 0, 0]} center style={{ pointerEvents: 'none', zIndex: 10000 }} zIndexRange={[0, 0]}>
          <div
            style={{
              color: 'white',
              fontSize: 14,
              fontFamily: 'sans-serif',
              whiteSpace: 'nowrap',
              textShadow: '0 0 2px black, 0 0 4px black, 1px 1px 0 black, -1px -1px 0 black',
            }}
          >
            {length.toFixed(2)} m
          </div>
        </Html>
      )}
    </group>
  )
}

const PointSphere = ({ position }: { position: THREE.Vector3 }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, size } = useThree()

  useFrame(() => {
    if (!meshRef.current) return
    const camDist = camera.position.distanceTo(position)
    const scale = worldSizeAtDepth(camera, size, camDist, POINT_PX)
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef} position={position} renderOrder={MEASUREMENT_RENDER_ORDER}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial
        color="white"
        transparent
        opacity={1}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  )
}

export const MeasurementDisplay = () => {
  const { points, chainStarts, previewPoint, placementEnded, isMeasurementMode } = useMeasurementStore()
  const hasAnything = points.length > 0 || previewPoint !== null
  const chainStartSet = new Set(chainStarts)

  if (!isMeasurementMode && !hasAnything) return null

  return (
    <group>
      {points.map((p, i) => (
        <PointSphere key={i} position={p} />
      ))}
      {previewPoint && <PointSphere position={previewPoint} />}
      {points.map((_, i) => {
        if (chainStartSet.has(i + 1)) return null
        const from = points[i]
        const to = points[i + 1] ?? previewPoint
        if (!to) return null
        if (placementEnded && to === previewPoint) return null
        return (
          <Segment
            key={i}
            from={from}
            to={to}
            showLabel={true}
          />
        )
      })}
    </group>
  )
}
