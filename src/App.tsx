import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Scene from './components/Scene'
import { useModels, AppContextProvider } from './context/AppContext'
import { BsHeadsetVr } from "react-icons/bs";
import { MdOutlineFileUpload } from "react-icons/md";

const ModelSelect = () => {
  return (
    <div className="absolute top-8 left-8">
      <Select>
        <SelectTrigger className="w-48 bg-black text-white rounded-full border-none p-6">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="bg-black text-white border-none p-1">
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

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
        className="absolute top-8 left-58 rounded-full gap-1 h-12"
        onClick={() => fileInputRef.current?.click()}
      >
        <MdOutlineFileUpload size={20} />
        <p className="text-white text-xs">(.glb)</p>
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
        <ModelSelect />
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
