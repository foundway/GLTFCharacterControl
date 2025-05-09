import { useState, useRef } from 'react'
import { Container, Text } from '@react-three/uikit'
import { Button, Card } from '@react-three/uikit-default'
import { Check, ChevronRight } from '@react-three/uikit-lucide'
import { useSceneStore, Environments } from '../../store/useSceneStore'

export const EnvironmentMenu = () => {
  const [showEnvironmentsMenu, setShowEnvironmentsMenu] = useState(false)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)
  const { setEnvironment, currentEnvironment, showBackground, toggleBackground, showGrid, toggleGrid } = useSceneStore()
  const MENU_HOVER_DELAY = 300

  const handleEnvironmentsMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setShowEnvironmentsMenu(true)
    }, MENU_HOVER_DELAY)
  }

  const handleEnvironmentsMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setShowEnvironmentsMenu(false)
  }

  return (
    <Container 
      flexDirection="row" 
      alignItems="flex-end"
      onPointerEnter={handleEnvironmentsMouseEnter}
      onPointerLeave={handleEnvironmentsMouseLeave}
    >
      <Button variant="ghost" >
        <Text width={"100%"}>Environments</Text>
        <ChevronRight />
      </Button>
      <Container width={0} height={0} >
        {showEnvironmentsMenu && ( <Card 
          positionType="absolute"
          positionLeft={-12} 
          positionBottom={0} 
          padding={4}
          margin={8}
          width={200}
        >
          <Button onClick={toggleBackground} variant="ghost" gap={8}>
            <Container width={24} />
            <Text width={"100%"}>{showBackground ? 'Hide Background' : 'Show Background'}</Text>
          </Button>
          <Container height={1} width={"100%"} backgroundColor={"#eee"}/>
          {Object.entries(Environments).map(([name, url]) => ( <Button
            key={name}
            variant="ghost"
            gap={8}
            alignItems="center"
            onClick={() => setEnvironment(url)}
            >
            {currentEnvironment === url ? <Check /> : <Container width={24} />}
            <Text width="100%">{name}</Text>
          </Button>
          ))}
          <Container height={1} width={"100%"} backgroundColor={"#eee"}/>
          <Button onClick={toggleGrid} variant="ghost" gap={8}>
            <Container width={24} />
            <Text width={"100%"}>{showGrid ? 'Hide Grid' : 'Show Grid'}</Text>
          </Button>
        </Card>)}
      </Container>
    </Container>
  )
} 