import { Root, Container, Text } from '@react-three/uikit'
import { Button, Slider } from '@react-three/uikit-default'
import { useXRStore } from '../../store/useXRStore'
import { useXR } from '@react-three/xr'
import { useEnvironmentStore } from '../../store/useEnvironmentStore'
import { useState } from 'react'

export const Menu = () => {
  const { toggleXR } = useXRStore()
  const { session } = useXR()
  const { showEnvironment, toggleEnvironment } = useEnvironmentStore()
  const [isMenuVisible, setIsMenuVisible] = useState(true)

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

  if (session) {
    return (
        <group position={[0, 2, -1]} >
            <Root pixelSize={0.002} key={`root-${showEnvironment}`}>
                <Container 
                  flexDirection="column" 
                  gap={4} 
                  backgroundColor="rgba(0, 0, 0, 0.7)"
                  padding={16}
                  borderRadius={8}
                >
                  {isMenuVisible && (
                    <>
                      {session && (
                          <Button onClick={handleXRClick}>
                          <Text>Exit XR</Text>
                          </Button>
                      )}
                      <Button onClick={toggleEnvironment}>
                          <Text>{showEnvironment ? 'Hide Environment' : 'Show Environment'}</Text>
                      </Button>
                    </>
                  )}
                  <Button onClick={toggleMenu}>
                    <Text>{isMenuVisible ? 'Hide Menu' : 'Show Menu'}</Text>
                  </Button>
                </Container>
            </Root>
        </group>
    )
  } else {
    return null
  }
}