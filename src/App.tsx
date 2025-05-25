import React from 'react'
import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import Scene from './components/Scene'
import { useModels, AppContextProvider } from './context/AppContext'
import { BsHeadsetVr } from "react-icons/bs";
import { MdOutlineFileUpload } from "react-icons/md";

const ModelSelect = () => {
  const { models, currentModel, setCurrentModel } = useModels();

  const handleChange = (value: string) => {
    const found = models.find((m) => m.url === value);
    if (found) setCurrentModel(found);
  };

  return (
    <div className="absolute top-8 left-8">
      <Select value={currentModel.url} onValueChange={handleChange}>
        <SelectTrigger className="w-48 bg-black text-white rounded-full border-none p-6">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="bg-black text-white border-none p-1">
          <SelectGroup>
            {models.map((model) => (
              <SelectItem key={model.url} value={model.url}>{model.name}</SelectItem>
            ))}
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
      const name = file.name.replace(/\.[^/.]+$/, "") // Remove extension for display
      addModel({ name, url })
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

const store = createXRStore({
  controller: {rayPointer: {minDistance: 0.01}, grabPointer: false, teleportPointer: false}, // TODO: use custom XRController with tooltips
  bounded: false
})

const App = () => {
  return (
    <AppContextProvider>
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas
          shadows
          camera={{ position: [0, 1.6, 2], fov: 50 }}
        >
          <XR store={store}>
            <Scene />
          </XR>
        </Canvas>
        <ModelSelect />
        <UploadButton />
        <Button 
          className="absolute top-8 right-8 rounded-full gap-3 p-6" 
          onClick={() => store.enterAR()}>
          <BsHeadsetVr size={20} />
          Enter XR
        </Button>
      </div>
    </AppContextProvider>
  )
}

export default App