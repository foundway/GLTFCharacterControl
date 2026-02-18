import React from 'react'
import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

import Scene from '@/components/three/Scene'
import { useModels, AppContextProvider } from './context/AppContext'
import { BsHeadsetVr } from "react-icons/bs";
import { MdOutlineFileUpload } from "react-icons/md";
import XRController from './components/three/XRController'
import { PanelEnvironmentMenu } from './components/ui/PanelEnvironmentMenu'

const ModelInfoCard = () => {
  const { currentModel } = useModels();
  
  return (
    <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-md rounded-[2px] px-4 py-3 text-white border border-white/10 flex flex-col gap-0">
      <h3 className="text-xs font-semibold mb-1">{currentModel.name}</h3>
      <div className="space-y-0.5 text-xs text-gray-300">
        <p className="mb-0.5">
          <span className="text-xs">Author: </span>
          {currentModel.authorURL ? (
            <a href={currentModel.authorURL} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline text-xs" >
              {currentModel.author}
            </a>
          ) : ('Unknown')}
        </p>
        <p className="mb-0.5"><span className="text-xs">License: </span>
          {currentModel.licenseURL ? (
          <a href={currentModel.licenseURL} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline text-xs" >
              {currentModel.license}
            </a>
          ) : ('Unknown')}
        </p>
      </div>
    </div>
  )
}

const ModelSelect = () => {
  const { models, currentModel, setCurrentModel } = useModels();

  const handleChange = (value: string) => {
    const found = models.find((m) => m.url === value);
    if (found) setCurrentModel(found);
  };

  return (
    <div>
      <Select value={currentModel.url} onValueChange={handleChange}>
        <SelectTrigger className="model-select-trigger bg-control text-white rounded-[2px] border-none p-3 h-[40px] hover:bg-[#2E3033] transition-colors cursor-pointer">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="bg-control text-white rounded-[2px] border-none px-0 py-1">
          <SelectGroup className="px-0 m-0 border-none">
            {models.map((model) => (
              <SelectItem 
                key={model.url} 
                value={model.url}
                className="hover:bg-[#2E3033] focus:bg-[#2E3033] focus:text-white cursor-pointer transition-colors rounded-[0px] px-3 py-2"
              >
                {model.name}
              </SelectItem>
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
      addModel({ name, url, author: 'User Upload', authorURL: 'n/a', license: 'User Upload', licenseURL: 'n/a' })
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
        className="bg-control rounded-[2px] gap-1 h-10 w-10 hover:bg-[#2E3033] cursor-pointer px-2"
        onClick={() => fileInputRef.current?.click()}
      >
        <MdOutlineFileUpload size={20} />
        {/* <p className="text-white text-xs"></p> */}
      </Button>
    </>
  )
}

const store = createXRStore({
  controller: XRController,
  bounded: false
})

const App = () => {
  return (
    <AppContextProvider>
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
        <Canvas
          className="pointer-events-none" // block inputs while using UIs
          camera={{ fov: 50 }}
          shadows
        >
          <XR store={store}>
            <Scene />
          </XR>
        </Canvas>
        <div className="pointer-events-auto">
          <span className='absolute left-2 top-2 gap-2 flex flex-row' style={{ gap: '8px' }}>
            <UploadButton />
            <ModelSelect />
          </span>
          <ModelInfoCard />
          <Button
            className="absolute top-2 right-2 w-[40px] bg-control rounded-[2px] gap-3 pt-[14px] pr-[10px] pb-[10px] pl-[10px] hover:bg-[#2E3033] cursor-pointer"
            onClick={() => store.enterAR()}>
            <BsHeadsetVr size={20} />
          </Button>
          <PanelEnvironmentMenu />
        </div>
      </div>
    </AppContextProvider>
  )
}

export default App