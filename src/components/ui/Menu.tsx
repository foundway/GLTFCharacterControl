import { Root, Container, Text } from '@react-three/uikit'
import { Button, Slider } from '@react-three/uikit-default'
import { useXRStore } from '../../store/useXRStore'
import { useXR } from '@react-three/xr'
import { useEnvironmentStore } from '../../store/useEnvironmentStore'
import { useTurntableStore } from '../../store/useTurntableStore'

export const Menu = () => {
  const { toggleXR } = useXRStore()
  const { session } = useXR()
  const { showEnvironment, toggleEnvironment } = useEnvironmentStore()
  const { isRotating, toggleRotation, elevation, setElevation } = useTurntableStore()

  const handleXRClick = () => {
    if (session) {
      session.end()
    } else {
      toggleXR()
    }
  }

  if (session) {
    return (
        <group position={[0, 2, -1]} >
            <Root pixelSize={0.002} key={`root-${showEnvironment}`}>
                <Container flexDirection="column" gap={4}>
                {session && (
                    <Button onClick={handleXRClick}>
                    <Text>Exit XR</Text>
                    </Button>
                )}
                <Button onClick={toggleEnvironment}>
                    <Text>{showEnvironment ? 'Hide Environment' : 'Show Environment'}</Text>
                </Button>
                <Button onClick={toggleRotation}>
                    <Text>{isRotating ? 'Stop Turntable' : 'Start Turntable'}</Text>
                </Button>
                <Text padding={4}>Elevation</Text>
                <Slider 
                    value={elevation} 
                    onValueChange={setElevation}
                    max={2} 
                    step={0.01} 
                    padding={4}
                />
                </Container>
            </Root>
        </group>
    )
  } else {
    return null
  }
}