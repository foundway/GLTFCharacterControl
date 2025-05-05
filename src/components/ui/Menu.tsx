import { useState, useRef } from 'react'
import { Vector3, Group } from 'three'
import { ThreeElements, useFrame, useThree } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { Root, Container, Text, setPreferredColorScheme, Fullscreen, DefaultProperties } from '@react-three/uikit'
import { Button, Card } from '@react-three/uikit-default'
import { Menu as MenuIcon, ChevronDown, ChevronUp } from '@react-three/uikit-lucide'
import { useXRStore } from '../../store/useXRStore'
import { useSceneStore } from '../../store/useSceneStore'

export const Menu = () => {
  const { toggleXR } = useXRStore()
  const { session } = useXR()
  const { showEnvironment, toggleEnvironment, showGrid, toggleGrid } = useSceneStore()
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const { camera } = useThree()
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!camera) return
    if (!groupRef.current) return

    const cameraForwardH = new Vector3()
    camera.getWorldDirection(cameraForwardH)
    cameraForwardH.y = 0;
    const menuForwardH = groupRef.current.position.clone().sub(camera.position).normalize()
    menuForwardH.y = 0;

    if (cameraForwardH.angleTo(menuForwardH) * (180/Math.PI) < 30) {
      cameraForwardH.copy(menuForwardH)
    }
    const targetPosition = camera.position.clone().add(cameraForwardH.multiplyScalar(0.9))
    groupRef.current.position.copy(targetPosition)
    groupRef.current.lookAt(camera.position)
  })

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

  if (!session) return null

  setPreferredColorScheme("dark")

  return (
    <group ref={groupRef}>
      <Root pixelSize={0.002} flexDirection={"column"} alignItems={"center"}>
        {isMenuVisible && (<Card 
          positionType="absolute"
          positionBottom={50}
          flexDirection="column" 
          alignItems="stretch"
          padding={4}
        >
          <Button onClick={handleXRClick} variant="ghost">
            <Text>Exit XR</Text>
          </Button>
          <Button onClick={toggleEnvironment} variant="ghost">
            <Text>{showEnvironment ? 'Hide Environment' : 'Show Environment'}</Text>
          </Button>
          <Button onClick={toggleGrid} variant="ghost">
            <Text>{showGrid ? 'Hide Grid' : 'Show Grid'}</Text>
          </Button>
        </Card>)}
        <Button onClick={toggleMenu} variant="secondary" size="icon" >
          {isMenuVisible ? <ChevronDown /> : <MenuIcon />}
        </Button>
      </Root>
    </group>
  )
}