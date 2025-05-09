import { useState, useRef } from 'react'
import { Container, Text } from '@react-three/uikit'
import { Button, Card } from '@react-three/uikit-default'
import { ChevronRight } from '@react-three/uikit-lucide'
import { useAnimationStore } from '../../store/useAnimationStore'

export const AnimationMenu = () => {
  const [showAnimationsMenu, setShowAnimationsMenu] = useState(false)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)
  const { animations, setCurrentAnimation } = useAnimationStore()
  const MENU_HOVER_DELAY = 300

  const handleAnimationsMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setShowAnimationsMenu(true)
    }, MENU_HOVER_DELAY)
  }

  const handleAnimationsMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setShowAnimationsMenu(false)
  }

  return (
    <Container 
      flexDirection="row" 
      alignItems="flex-end"
      onPointerEnter={handleAnimationsMouseEnter}
      onPointerLeave={handleAnimationsMouseLeave}
    >
      <Button variant="ghost" >
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
            animations.map((clip) => (
              <Button
                key={clip.name}
                variant="ghost"
                onClick={() => setCurrentAnimation(clip.name)}
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
  )
} 