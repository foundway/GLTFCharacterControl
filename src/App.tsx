import { Canvas } from '@react-three/fiber'
import { Button } from '@/components/ui/button'
import Scene from './components/Scene'
import { useState } from 'react'
import { useAnimationStore } from './store/useAnimationStore'

const App = () => {
  const { currentAnimation, setCurrentAnimation } = useAnimationStore()

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [3, 1, 3], fov: 50 }}>
        {/* <Scene currentAnimation={currentAnimation} /> */}
        <Scene />
      </Canvas>
      <div className="absolute top-8 left-8 flex flex-col gap-2">
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
