import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useRef } from 'react'
import { Group } from 'three'
import { Character } from './Character'

const Scene = () => {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <>
      <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rostock_laage_airport_2k.hdr"
        ground={{ height: 5, radius: 40, scale: 20 }} />
        <group ref={groupRef}>
          <Character />
        </group>
      <ContactShadows opacity={0.5} />
      <OrbitControls makeDefault target={[0, 1, 0]} />
    </>
  )
}

export default Scene 