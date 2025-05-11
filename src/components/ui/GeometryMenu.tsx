import { useState, useRef } from 'react'
import { Container, Input, Text } from '@react-three/uikit'
import { Button, Card, Slider } from '@react-three/uikit-default'
import { ChevronRight } from '@react-three/uikit-lucide'
import validator from 'validator'
import { useModelStore } from "../../store/ModelStore"

const InputSlider = () => {
  const ref = useRef<any>(null)
  const [hasValidNumber, setValidNumber] = useState(true)
  const [inputValue, setInputValue] = useState("1")
  const { scale, setScale } = useModelStore()
  return (
    <>
      <Container alignItems="center" gap={12}>
        <Container flexDirection="row" width={30} overflow="hidden" >
          <Input
            ref={ref} width="100%" height="100%"
            value={inputValue}
            backgroundColor={hasValidNumber ? undefined : "#411"}
            onValueChange={(value) => {
              setInputValue(value)
              if (validator.isFloat(value, { min: 0.1, max: 100 })) {
                setScale(parseFloat(value));
                setValidNumber(true);
              } else {
                setValidNumber(false)
              }
            }}
            onFocusChange={(focus) => {
              if (focus) {
                setInputValue("")
                ref.current.selectionColor = "#000"
              }
            }}
          />
        </Container>
        <Slider
          min={0.1} max={3} step={0.01} width={120} value={scale}
          onValueChange={(value) => {
            setScale(value)
            setInputValue(value.toFixed(2))
            setValidNumber(true)
            ref.current.blur()
          }}
        />
      </Container>
    </>
  )
}

export const GeometryMenu = () => {
  const [showGeometryMenu, setShowGeometryMenu] = useState(false)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)
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
        </Card>)}
      </Container>
    </Container>
  )
} 