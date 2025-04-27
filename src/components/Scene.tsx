import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { useRef } from 'react'
import { Group } from 'three'
import { Character } from './Character'
import { Menu } from './ui/Menu'
import { useEnvironmentStore } from '../store/useEnvironmentStore'
import { useTurntableStore } from '../store/useTurntableStore'

const Scene = () => {
  const groupRef = useRef<Group>(null)
  const { showEnvironment } = useEnvironmentStore()
  const { isRotating, elevation } = useTurntableStore()

  useFrame((_, delta) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <>
      <color attach="background" args={['#333333']} />
      <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rostock_laage_airport_2k.hdr"
        {...(showEnvironment ? {
          background: true,
          ground: { height: 5, radius: 40, scale: 100 } // "ground" automatically discards other background settings. TODO: submit an issue on github.
        } : { background: false })}
      />
      <group ref={groupRef} position={[0, elevation, -1]}>
        <Character />
      </group>
      <OrbitControls makeDefault target={[0, 1, -1]} />
      <Menu />
      <Grid
        position={[0, 0, 0]}
        args={[20, 20]}
        cellSize={0.5}
        cellThickness={1}
        cellColor="#eee"
        sectionSize={100}
        sectionThickness={1.5}
        sectionColor="#944"
        fadeDistance={5}
      />
    </>
  )
}

export default Scene 