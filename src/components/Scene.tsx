import { OrbitControls, Environment, Grid } from '@react-three/drei'
import { useXR } from '@react-three/xr'
import { Character } from './Character'
import { Menu } from './ui/Menu'
import { useSceneStore } from '../store/useSceneStore'

const Scene = () => {
  const { showEnvironment, showGrid, currentEnvironment } = useSceneStore()
  const { session } = useXR()

  return (
    <>
      <color attach="background" args={['#333333']} />
      <Environment
        files={currentEnvironment}
        {...(showEnvironment ? {
          background: true,
          ground: { height: 5, radius: 40, scale: 100 }
        } : { background: false })}
      />
      <group position={[0, 0, -1]}>
        <Character />
      </group>
      {!session && <OrbitControls target={[0, 0.5, -1]} />}
      {showGrid && (
        <group renderOrder={-1}>
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
          />
        </group>
      )}
      <Menu />
    </>
  )
}

export default Scene 