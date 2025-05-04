import { useRef } from 'react'
import { Group } from 'three'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { Character } from './Character'
import { Menu } from './ui/Menu'
import { useEnvironmentStore } from '../store/useEnvironmentStore'

const Scene = () => {
  const groupRef = useRef<Group>(null)
  const { showEnvironment } = useEnvironmentStore()

  return (
    <>
      <color attach="background" args={['#333333']} />
      <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/rostock_laage_airport_2k.hdr"
        {...(showEnvironment ? {
          background: true,
          ground: { height: 5, radius: 40, scale: 100 }
        } : { background: false })}
      />
      <group ref={groupRef} position={[0, 0, -1]}>
        <Character />
      </group>
      <OrbitControls makeDefault target={[0, 0.5, -1]} />
      <group renderOrder={-1}>
        <Grid
          position={[0, 0, 0]}
          args={[10, 10]}
          cellSize={0.2}
          cellThickness={1}
          cellColor="#eee"
          sectionSize={100}
          sectionThickness={1}
          sectionColor="#944"
          fadeDistance={2}
        />
      </group>
      <Menu />
    </>
  )
}

export default Scene 