import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import { useRef } from 'react'
import { Group } from 'three'
import { Character } from './Character'
import { useGLTF } from '@react-three/drei'
import { useModelStore } from '../store/useModelStore'
// import { useXR } from '@react-three/xr'

const Scene = () => {
  const groupRef = useRef<Group>(null)
  const { models } = useModelStore()
  const lastModel = models[models.length - 1]
  const uploadedGLTF = lastModel ? useGLTF(lastModel) : null
  // const { session } = useXR()

  // useFrame((_, delta) => {
  //   // if (groupRef.current && !session) {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.y += delta * 0.5
  //   }
  // })

  return (
    <>
      {/* <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rostock_laage_airport_2k.hdr"
        ground={{ height: 5, radius: 40, scale: 20 }} /> */}
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <ambientLight intensity={1} />
      <group ref={groupRef}>
        <Character />
        {/* {lastModel && uploadedGLTF && <primitive object={uploadedGLTF.scene} />} */}
      </group>
      <ContactShadows opacity={0.5} />
      {/* {!session && <OrbitControls makeDefault target={[0, 1, 0]} />} */}
      <OrbitControls makeDefault target={[0, 1, 0]} />
    </>
  )
}

export default Scene 