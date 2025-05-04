import { Root, Container, Text } from '@react-three/uikit'
import { Button } from '@react-three/uikit-default'
import { useXRStore } from '../../store/useXRStore'
import { useXR } from '@react-three/xr'
import { useEnvironmentStore } from '../../store/useEnvironmentStore'
import { useState, useRef } from 'react'
import { ThreeElements } from '@react-three/fiber'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3 } from 'three'

type MenuProps = ThreeElements['group']

export const Menu = (props: MenuProps) => {
  const { toggleXR } = useXRStore()
  const { session } = useXR()
  const { showEnvironment, toggleEnvironment } = useEnvironmentStore()
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const { camera } = useThree()
  const [position, setPosition] = useState(new Vector3(0, 2, -1))
  const targetPosition = useRef(new Vector3(0, 2, -1))

  useFrame((_, delta) => {
    if (!camera?.position) return

    targetPosition.current.set(
      camera.position.x,
      camera.position.y - 0.7, 
      camera.position.z - 0.9 
    )
    
    const newPosition = position.clone().lerp(targetPosition.current, delta * 10)
    setPosition(newPosition)
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

  return (
    <group position={position} {...props}>
      <Root pixelSize={0.0015}>
        <Container 
          key={isMenuVisible ? 'menu-content' : 'menu-button'} // fix for the menu not updating when the menu is hidden
          flexDirection="column" 
          alignSelf={"flex-start"}
          gap={4} 
          backgroundColor="rgb(234, 234, 234)"
          padding={16}
          borderRadius={8}
        >
          {isMenuVisible && (
            <>
              <Button onClick={handleXRClick}>
                <Text>Exit XR</Text>
              </Button>
              <Button onClick={toggleEnvironment}>
                <Text>{showEnvironment ? 'Hide Environment' : 'Show Environment'}</Text>
              </Button>
            </>
          )}
          <Button onClick={toggleMenu}>
            <Text>{isMenuVisible ? 'Close Menu' : 'Open Menu'}</Text>
          </Button>
        </Container>
      </Root>
    </group>
  )
}