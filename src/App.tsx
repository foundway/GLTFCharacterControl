import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Button } from '@/components/ui/button'
import { useAnimationStore } from './store/useAnimationStore'
import { useModelStore } from './store/useModelStore'
import Scene from './components/Scene'

const App = () => {
  const { setCurrentAnimation } = useAnimationStore()
  const { addModel } = useModelStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const store = createXRStore()

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
        <XR store={store}>
          <Scene />
        </XR>
      </Canvas>
      <div className="absolute top-8 left-8 flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept=".glb"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button onClick={() => fileInputRef.current?.click()}>
          Upload GLTF
        </Button>
        <Button onClick={() => setCurrentAnimation('TRACK-idle')}>
          Normal Idle
        </Button>
        <Button onClick={() => setCurrentAnimation('TRACK-sad-idle')}>
          Sad Idle
        </Button>
        <Button onClick={() => setCurrentAnimation('TRACK-arm-stretching')}>
          Arm Stretching
        </Button>
        <Button onClick={() => store.enterVR()}>
          Enter AR
        </Button>
      </div>
    </div>
  )
}

export default App
