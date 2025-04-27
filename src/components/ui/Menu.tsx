import { Root, Container, Text } from '@react-three/uikit'
import { Button } from '@react-three/uikit-default'
import { useXRStore } from '../../store/useXRStore'
import { useXR } from '@react-three/xr'
import { useEnvironmentStore } from '../../store/useEnvironmentStore'

export const Menu = () => {
  const { isXR, toggleXR } = useXRStore()
  const { session } = useXR()
  const { showEnvironment, toggleEnvironment } = useEnvironmentStore()

  const handleXRClick = () => {
    if (session) {
      session.end()
    } else {
      toggleXR()
    }
  }

  return (
    <group position={[0, 2, -1]}>
      <Root pixelSize={0.002}>
        <Container flexDirection="column" gap={4}>
          {session && (
            <Button onClick={handleXRClick}>
              <Text>Exit XR</Text>
            </Button>
          )}
          <Button onClick={toggleEnvironment}>
            <Text>{showEnvironment ? 'Hide Environment' : 'Show Environment'}</Text>
          </Button>
        </Container>
      </Root>
    </group>
  )
}