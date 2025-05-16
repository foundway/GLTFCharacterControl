import { Container, Text } from '@react-three/uikit'
import { Button } from '@react-three/uikit-default'
import { useAnimationStore } from '../../store/AnimationStore'
import { SubMenu } from './SubMenu'

export const AnimationMenu = () => {
  const { animations, setCurrentAnimation } = useAnimationStore()

  return (
    <SubMenu title="Animations">
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
    </SubMenu>
  )
} 