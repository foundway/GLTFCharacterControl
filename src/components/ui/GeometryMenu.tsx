import { useState, useRef } from 'react'
import * as THREE from 'three'
import { Container, Text } from '@react-three/uikit'
import { Button, Card, Separator, Slider } from '@react-three/uikit-default'
import { ChevronRight } from '@react-three/uikit-lucide'
import { useModelStore } from "../../store/ModelStore"
import { useThree } from '@react-three/fiber'

const InputSlider = () => {
  const { scale, setScale } = useModelStore()
  return (
    <Container flexDirection="column" marginTop={0} marginLeft={12} marginRight={12} marginBottom={8}>
      <Text paddingBottom={16} fontWeight="bold" fontSize={14}>Scale</Text>
      <Container alignItems="center" gap={12} paddingRight={12}>
        <Text width={40} textAlign="left">{scale.toFixed(2)}</Text>
        <Slider
          min={0.1} max={3} step={0.01} width={120} value={scale}
          onValueChange={(value) => {
            setScale(value)
          }}
        />
      </Container>
    </Container>
  )
}

export const GeometryMenu = () => {
  const [showGeometryMenu, setShowGeometryMenu] = useState(false)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)
  const { scene } = useThree()
  const { setScale } = useModelStore()
  const MENU_HOVER_DELAY = 300

  const handlePointerEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setShowGeometryMenu(true)
    }, MENU_HOVER_DELAY)
  }

  const handlePointerLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setShowGeometryMenu(false)
  }

  const resetTransformation = () => {
    setScale(1)
    scene.traverse((object) => {
      if (object instanceof THREE.Object3D && object.userData.isCharacter) {
        object.parent?.position.set(0, 0, 0)
        object.parent?.rotation.set(0, 0, 0)
      }
    })
  }

  return (
    <Container
      flexDirection="row"
      alignItems="flex-end"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <Button variant="ghost" >
        <Text width={"100%"}>Geometry</Text>
        <ChevronRight />
      </Button>
      <Container width={0} height={0} >
        {showGeometryMenu && (<Card
          positionType="absolute"
          positionLeft={-12}
          positionBottom={-8}
          padding={12}
          margin={8}
        >
          <InputSlider />
          <Separator />
          <Button variant="ghost" onClick={resetTransformation}>
            <Text width={"100%"}>Reset Transformation</Text>
          </Button>
        </Card>)}
      </Container>
    </Container>
  )
} 