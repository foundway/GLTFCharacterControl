import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Scene from '@/components/three/Scene'
import { useModels, AppContextProvider } from './context/AppContext'
import { BsHeadsetVr } from 'react-icons/bs'
import { FaRegFolderOpen } from 'react-icons/fa'
import XRController from './components/three/XRController'
import { PanelEnvironmentMenu } from './components/ui/PanelEnvironmentMenu'
import { PanelGeometryMenu } from './components/ui/PanelGeometryMenu'
import { PanelAnnotationMenu } from './components/ui/PanelAnnotationMenu'
import { AnnotationDialogs } from './components/ui/AnnotationDialogs'
import { useAnnotationStore } from './store/AnnotationStore'
import { useMeasurementStore } from './store/MeasurementStore'
import { useSceneStore } from './store/SceneStore'
import { PiRuler } from 'react-icons/pi'
import { LuLayoutPanelTop } from 'react-icons/lu'

const ModelInfoCard = () => {
  const { displayModel } = useModels()

  return (
    <div className="absolute bottom-2 left-2 w-fit min-w-0 bg-black/40 backdrop-blur-md rounded-[2px] px-4 py-3 text-white border border-white/10 flex flex-col gap-0">
      <h3 className="text-xs font-semibold mb-1 whitespace-nowrap">{displayModel.name}</h3>
      <div className="space-y-0.5 text-xs text-gray-300">
        <p className="mb-0.5 whitespace-nowrap">
          <span className="text-xs">Author: </span>
          {displayModel.authorURL ? (
            <a href={displayModel.authorURL} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline text-xs">
              {displayModel.author}
            </a>
          ) : (displayModel.author || 'Unknown')}
        </p>
        <p className="mb-0.5 whitespace-nowrap">
          <span className="text-xs">License: </span>
          {displayModel.licenseURL ? (
            <a href={displayModel.licenseURL} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 underline text-xs">
              {displayModel.license}
            </a>
          ) : (displayModel.license || 'Unknown')}
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
        <FaRegFolderOpen size={20} />
        {/* <p className="text-white text-xs"></p> */}
      </Button>
    </>
  )
}

const store = createXRStore({
  controller: XRController,
  bounded: false
})

const MeasurementButton = () => {
  const isMeasurementMode = useMeasurementStore((s) => s.isMeasurementMode)
  const setMeasurementMode = useMeasurementStore((s) => s.setMeasurementMode)
  return (
    <Button
      className={`w-[40px] h-[40px] bg-control rounded-[2px] p-0 flex items-center justify-center hover:bg-[#2E3033] cursor-pointer`}
      onClick={() => {
        useAnnotationStore.getState().setPlacing(false)
        setMeasurementMode(!isMeasurementMode)
      }}
    >
      <PiRuler size={20} className={isMeasurementMode ? 'text-[#32A0C8]' : 'text-white'} />
    </Button>
  )
}

const UISamplerButton = () => {
  const showUISampler = useSceneStore((s) => s.showUISampler)
  const toggleUISampler = useSceneStore((s) => s.toggleUISampler)
  return (
    <Button
      className={`w-[40px] h-[40px] bg-control rounded-[2px] p-0 flex items-center justify-center hover:bg-[#2E3033] cursor-pointer`}
      onClick={toggleUISampler}
    >
      <LuLayoutPanelTop size={20} className={showUISampler ? 'text-[#32A0C8]' : 'text-white'} />
    </Button>
  )
}

const PlacementCursor = () => {
  const isPlacing = useAnnotationStore((s) => s.isPlacingAnnotation)
  const isMeasurementMode = useMeasurementStore((s) => s.isMeasurementMode)
  useEffect(() => {
    document.body.style.cursor = isMeasurementMode || isPlacing ? 'crosshair' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [isPlacing, isMeasurementMode])
  return null
}

const AppOverlay = () => {
  const { currentModel } = useModels()
  const showUISampler = useSceneStore((s) => s.showUISampler)
  useEffect(() => {
    useAnnotationStore.getState().load()
  }, [])
  useEffect(() => {
    useAnnotationStore.getState().setCurrentModelUrl(currentModel.url)
  }, [currentModel.url])
  useEffect(() => {
    useMeasurementStore.getState().setMeasurementMode(false)
  }, [currentModel.url])

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col z-10">
      {!showUISampler && (
        <>
          <span className="absolute left-2 top-2 gap-2 flex flex-row pointer-events-auto" style={{ gap: '8px' }}>
            <ModelSelect />
            <UploadButton />
          </span>
          <div className="absolute bottom-2 left-2 pointer-events-auto">
            <ModelInfoCard />
          </div>
        </>
      )}
      <div className="absolute top-2 right-2 flex flex-col gap-2 pointer-events-auto">
        {!showUISampler && (
          <>
            <Button
              className="w-[40px] bg-control rounded-[2px] gap-3 pt-[14px] pr-[10px] pb-[10px] pl-[10px] hover:bg-[#2E3033] cursor-pointer"
              onClick={() => store.enterAR()}
            >
              <BsHeadsetVr size={20} />
            </Button>
            <PanelEnvironmentMenu />
            <PanelGeometryMenu />
            <PanelAnnotationMenu />
            <MeasurementButton />
          </>
        )}
        <UISamplerButton />
      </div>
      {!showUISampler && <AnnotationDialogs />}
      <PlacementCursor />
    </div>
  )
}

const App = () => {
  return (
    <AppContextProvider>
      <div style={{ width: '100vw', height: '100vh', backgroundColor: 'black' }}>
        <Canvas className="pointer-events-auto" camera={{ fov: 50 }} shadows>
          <XR store={store}>
            <Scene />
          </XR>
        </Canvas>
        <AppOverlay />
      </div>
    </AppContextProvider>
  )
}

export default App