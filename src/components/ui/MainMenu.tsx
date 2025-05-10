import { useState, useRef } from 'react'
import { Vector3, Group } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { Root, Text, setPreferredColorScheme } from '@react-three/uikit'
import { Button, Card } from '@react-three/uikit-default'
import { Menu as MenuIcon, ChevronDown } from '@react-three/uikit-lucide'
import { useXRStore } from '../../store/useXRStore'
import { EnvironmentMenu } from './EnvironmentMenu'
import { AnimationMenu } from './AnimationMenu'
import { GeometryMenu } from './GeometryMenu'
import { Separator } from './Separator'

export const MainMenu = () => {
  const { camera } = useThree()
  const { session } = useXR()
  const { toggleXR } = useXRStore()
  const groupRef = useRef<Group>(null)
  const prevCameraForwardH = useRef(new Vector3())
  const prevTargetPosition = useRef(new Vector3())
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const ANGLE_THRESHOLD = 30
  const LERP_SPEED = 4 
  const Y_OFFSET = -0.6
  const Z_OFFSET = 1

  useFrame((_, delta) => {
    updateMenuPosition(delta)
  })

  const updateMenuPosition = (delta: number) => {
    if (!camera) return
    if (!groupRef.current) return

    const cameraForwardH = new Vector3()
    camera.getWorldDirection(cameraForwardH)
    cameraForwardH.y = Y_OFFSET;
    
    if (cameraForwardH.angleTo(prevCameraForwardH.current) * (180/Math.PI) < ANGLE_THRESHOLD) {
      cameraForwardH.copy(prevCameraForwardH.current)
    } else {
      prevCameraForwardH.current.copy(cameraForwardH)
    }
    const targetPosition = camera.position.clone().add(cameraForwardH.multiplyScalar(Z_OFFSET))
    const smoothPosition = prevTargetPosition.current.lerp(targetPosition, 1 - Math.exp(-LERP_SPEED * delta))
    groupRef.current.position.copy(smoothPosition)
    groupRef.current.lookAt(camera.position)
  }

  const handleXRClick = () => {
    if (session) {
      session.end()
    } else {
      toggleXR()
    }
  }

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible)
  }

  setPreferredColorScheme("dark")

  if (!session) return null

  return (
    <group ref={groupRef} >
      <Root pixelSize={0.0015} flexDirection={"column"} alignItems={"center"} depthTest={false} depthWrite={false}>
        {isMenuVisible && (<Card 
          positionType="absolute"
          positionBottom={50}
          flexDirection="column" 
          alignItems="stretch"
          padding={4}
        >
          <EnvironmentMenu />
          <AnimationMenu />
          <GeometryMenu />
          <Separator />
          <Button onClick={handleXRClick} variant="ghost">
            <Text width={"100%"}>Exit XR</Text>
          </Button>
        </Card>)}
        <Button onClick={toggleMenu} variant="secondary" size="icon" borderRadius={100} >
          {isMenuVisible ? <ChevronDown /> : <MenuIcon />}
        </Button>
      </Root>
    </group>
  )
}
