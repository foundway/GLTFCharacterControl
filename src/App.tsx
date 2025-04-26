import { Canvas } from '@react-three/fiber'
import { Button } from '@/components/ui/button'
import Scene from './components/Scene'
import { useAnimationStore } from './store/useAnimationStore'
import { useModelStore } from './store/useModelStore'
import { useRef } from 'react'

const App = () => {
  const { setCurrentAnimation } = useAnimationStore()
  const { addModel } = useModelStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      addModel(url)
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [3, 1, 3], fov: 50 }}>
        {/* <Scene currentAnimation={currentAnimation} /> */}
        <Scene />
      </Canvas>
      <div className="absolute top-8 left-8 flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept=".gltf,.glb"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          Upload GLTF Model
        </Button>
        <Button onClick={() => setCurrentAnimation('TRACK-idle')}>
          Normal Idle
        </Button>
        {/* <Button onClick={() => setCurrentAnimation('TRACK-sad-idle')}> */}
        <Button onClick={() => setCurrentAnimation('TRACK-sad-idle')}>
          Sad Idle
        </Button>
        <Button onClick={() => setCurrentAnimation('TRACK-arm-stretching')}>
          Arm Stretching
        </Button>
      </div>
    </div>
  )
}

export default App
