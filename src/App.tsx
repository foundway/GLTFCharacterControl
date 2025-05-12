import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Button } from '@/components/ui/button'
import Scene from './components/Scene'
import { useModels, AppContextProvider } from './context/AppContext'
import { BsHeadsetVr } from "react-icons/bs";
import { MdOutlineFileUpload } from "react-icons/md";

const UploadButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addModel } = useModels()
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      addModel(url)
    }
  }
  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        accept=".glb"
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button 
        className="absolute bottom-8 left-8 rounded-full gap-1 p-6"
        onClick={() => fileInputRef.current?.click()}
      >
        <MdOutlineFileUpload size={20} />
        Load GLB
      </Button>
    </>
  )
}

const App = () => {
  const store = createXRStore({
    bounded: false
  })

  return (
    <AppContextProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas
          shadows
          camera={{ position: [0, 1, 0], fov: 50 }}
        >
          <XR store={store}>
            <Scene />
          </XR>
        </Canvas>
        <UploadButton />
        <Button 
          className="absolute bottom-8 right-8 rounded-full gap-3 p-6" 
          onClick={() => store.enterAR()}>
          <BsHeadsetVr size={20} />
          Enter XR
        </Button>
      </div>
    </AppContextProvider>
  )
}

export default App
