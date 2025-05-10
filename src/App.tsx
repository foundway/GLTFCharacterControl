import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Button } from '@/components/ui/button'
import Scene from './components/Scene'
import { useModelStore } from './store/useModelStore'
import { ScaleProvider } from './context/ScaleContext'

const App = () => {
  const { addModel } = useModelStore()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const store = createXRStore({
    bounded: false
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      addModel(url)
    }
  }

  return (
    <ScaleProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas 
          shadows 
          camera={{ position: [0, 1, 0], fov: 50 }}
        >
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
            Load GLB Model
          </Button>
          <Button onClick={() => store.enterAR()}>
            Enter XR
          </Button>
        </div>
      </div>
    </ScaleProvider>
  )
}

export default App
