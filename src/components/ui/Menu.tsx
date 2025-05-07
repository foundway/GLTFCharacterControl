import { useState, useRef } from 'react'
import { Vector3, Group } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useXR } from '@react-three/xr'
import { Root, Text, setPreferredColorScheme, Container} from '@react-three/uikit'
import { Button, Card } from '@react-three/uikit-default'
import { Menu as MenuIcon, ChevronDown, ChevronRight } from '@react-three/uikit-lucide'
import { useXRStore } from '../../store/useXRStore'
import { useSceneStore } from '../../store/useSceneStore'
import { useAnimationStore } from '../../store/useAnimationStore'

export const Menu = () => {
  const { camera } = useThree()
  const { session } = useXR()
  const { toggleXR } = useXRStore()
  const { showEnvironment, toggleEnvironment, showGrid, toggleGrid } = useSceneStore()
  const { animations, actions } = useAnimationStore()
  const groupRef = useRef<Group>(null)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)
  const prevCameraForwardH = useRef(new Vector3())
  const prevTargetPosition = useRef(new Vector3())
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [showAnimationsMenu, setShowAnimationsMenu] = useState(false)
  const ANGLE_THRESHOLD = 30
  const LERP_SPEED = 4 
  const Y_OFFSET = -0.6
  const Z_OFFSET = 1
  const MENU_HOVER_DELAY = 300

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

  const handleAnimationsMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setShowAnimationsMenu(true)
    }, MENU_HOVER_DELAY)
  }

  const handleAnimationsMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setShowAnimationsMenu(false)
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
          <Button onClick={toggleEnvironment} variant="ghost">
            <Text width={"100%"}>{showEnvironment ? 'Hide Environment' : 'Show Environment'}</Text>
          </Button>
          <Button onClick={toggleGrid} variant="ghost">
            <Text width={"100%"}>{showGrid ? 'Hide Grid' : 'Show Grid'}</Text>
          </Button>
          <Container 
            flexDirection="row" 
            alignItems="flex-end"
            onPointerEnter={handleAnimationsMouseEnter}
            onPointerLeave={handleAnimationsMouseLeave}
          >
            <Button onClick={() => {}} variant="ghost" >
              <Text width={"100%"}>Animations</Text>
              <ChevronRight />
            </Button>
            <Container width={0} height={0} >
              {showAnimationsMenu && ( <Card 
                positionType="absolute"
                positionLeft={-12} 
                positionBottom={0} 
                padding={4}
                margin={8}
                width={200}
              >
                {animations && animations.length > 0 ? (
                  animations.map((clip, _) => (
                    <Button
                      key={clip.name}
                      variant="ghost"
                      onClick={() => {
                        actions[clip.name]?.reset().fadeIn(0.5).play()
                      }}
                    >
                      <Text width="100%">{clip.name}</Text>
                    </Button>
                  ))
                ) : (
                  <Text width="100%" padding={8}>No Animation</Text>
                )}
              </Card>)}
            </Container>
          </Container>
          <Button onClick={handleXRClick} variant="ghost">
            <Text width={"100%"}>Exit XR</Text>
          </Button>
        </Card>)}
        <Button onClick={toggleMenu} variant="secondary" size="icon" >
          {isMenuVisible ? <ChevronDown /> : <MenuIcon />}
        </Button>
      </Root>
    </group>
  )
}
