import { OrbitControls, Grid } from '@react-three/drei'
import { useXR, XROrigin } from '@react-three/xr'
import { Character } from './Character'
import { MainMenu } from './ui/MainMenu'
import { useSceneStore } from '../store/SceneStore'
import { Environment } from './Environment'

const Scene = () => {
  const { showGrid } = useSceneStore()
  const { session } = useXR()

  return (
    <>
      <color attach="background" args={['#333333']} />
      <Environment />
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
      <XROrigin position={[0, 0, 2]} >
        <MainMenu />
      </XROrigin>
    </>
  )
}

export default Scene 