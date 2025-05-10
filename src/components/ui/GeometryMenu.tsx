import { useState, useRef } from 'react'
import { Container, Text } from '@react-three/uikit'
import { Button, Card, Slider } from '@react-three/uikit-default'
import { ChevronRight } from '@react-three/uikit-lucide'
import { useScale } from '../../context/AppContext'

export const GeometryMenu = () => {
  const [showGeometryMenu, setShowGeometryMenu] = useState(false)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)
  const { scale, setScale } = useScale()
  const MENU_HOVER_DELAY = 300

  const handleGeometryMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setShowGeometryMenu(true)
    }, MENU_HOVER_DELAY)
  }

  const handleGeometryMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setShowGeometryMenu(false)
  }

  return (
    <Container 
      flexDirection="row" 
      alignItems="flex-end"
      onPointerEnter={handleGeometryMouseEnter}
      onPointerLeave={handleGeometryMouseLeave}
    >
      <Button variant="ghost" >
        <Text width={"100%"}>Geometry</Text>
        <ChevronRight />
      </Button>
      <Container width={0} height={0} >
        {showGeometryMenu && ( <Card 
          positionType="absolute"
          positionLeft={-12} 
          positionBottom={0} 
          padding={12}
          margin={8}
        >
          <Button variant="ghost" gap={8}>
            <Container width={24} />
            <Text width={"100%"}>Scale</Text>
          </Button>
          <Slider 
            min={0.1} 
            max={2} 
            step={0.1} 
            defaultValue={scale} 
            onValueChange={setScale}
            padding={24} 
            width="100%"
          />
        </Card>)}
      </Container>
    </Container>
  )
} 