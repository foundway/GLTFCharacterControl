import { useState } from 'react'
import { Root, Container, Text, setPreferredColorScheme } from '@react-three/uikit'
import {
  Card,
  Button,
  Input,
  Switch,
  Slider,
  Progress,
  Badge,
  Separator,
  Tabs,
  TabsList,
  TabsTrigger,
  baseBorderRadius,
  colors,
} from '@react-three/uikit-default'
import { Wifi, Bluetooth, BatteryFull, Search, Bell, Volume2, User, Play } from '@react-three/uikit-lucide'
import { themes } from '@react-three/uikit-default/dist/themes.js'
import { useSceneStore } from '@/store/SceneStore'

const PANEL_WIDTH = 360
const PANEL_HEIGHT = 620 // nominal rendered height, used only for fit math
const FRONT_GAP = 0.01
const FACE_FILL = 0.9 // fraction of the front face the panel should occupy

// Meta Horizon OS dark theme: neutral grays, soft-white primary actions, blue accent.
// Pure white/black are avoided per the OS color guidance (no darker than #1A1A1A).
const HORIZON_ACCENT = '#1c7ae0'
const HORIZON_DARK = {
  background: '#2b2b2e',
  foreground: '#ebebeb',
  card: '#1c1c1e',
  cardForeground: '#ebebeb',
  popover: '#1c1c1e',
  popoverForeground: '#ebebeb',
  primary: '#f5f5f5',
  primaryForeground: '#1c1c1e',
  secondary: '#3a3a3d',
  secondaryForeground: '#ebebeb',
  muted: '#262629',
  mutedForeground: '#b0b3b8',
  accent: '#3a3a3d',
  accentForeground: '#ebebeb',
  destructive: '#e5484d',
  destructiveForeground: '#f5f5f5',
  border: '#3a3a3d',
  input: '#48484b',
  ring: HORIZON_ACCENT,
} as const

// Mutate the default kit's active palette in place (Color.set avoids readonly typing),
// so every uikit component picks up Horizon tokens without per-instance overrides.
for (const key in HORIZON_DARK) {
  const token = key as keyof typeof HORIZON_DARK
  themes.slate.dark[token].set(HORIZON_DARK[token])
}
baseBorderRadius.value = 16 // Horizon's generously rounded corners

const Row = ({ children }: { children: React.ReactNode }) => (
  <Container flexDirection="row" alignItems="center" justifyContent="space-between" gap={12}>
    {children}
  </Container>
)

const SamplerPanel = () => {
  const [tab, setTab] = useState('home')
  const [notify, setNotify] = useState(true)
  const [volume, setVolume] = useState(60)

  return (
    <Card flexDirection="column" gap={14} padding={18} borderRadius={32} width={PANEL_WIDTH} borderColor={colors.input}>
      <Row>
        <Text fontSize={13} fontWeight="medium" opacity={0.7}>
          9:41
        </Text>
        <Container flexDirection="row" alignItems="center" gap={8}>
          <Wifi width={16} height={16} />
          <Bluetooth width={16} height={16} />
          <BatteryFull width={18} height={18} />
        </Container>
      </Row>

      <Row>
        <Container flexDirection="row" alignItems="center" gap={10}>
          <Container width={40} height={40} borderRadius={20} backgroundColor={HORIZON_ACCENT} alignItems="center" justifyContent="center">
            <User width={20} height={20} color="#f5f5f5" />
          </Container>
          <Container flexDirection="column">
            <Text fontSize={16} fontWeight="bold">
              Quest UI
            </Text>
            <Text fontSize={11} opacity={0.6}>
              Component sampler
            </Text>
          </Container>
        </Container>
        <Badge>
          <Text fontSize={11}>New</Text>
        </Badge>
      </Row>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList width="100%">
          <TabsTrigger value="home" flexGrow={1}>
            <Text fontSize={13}>Home</Text>
          </TabsTrigger>
          <TabsTrigger value="apps" flexGrow={1}>
            <Text fontSize={13}>Apps</Text>
          </TabsTrigger>
          <TabsTrigger value="settings" flexGrow={1}>
            <Text fontSize={13}>Settings</Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Container flexDirection="row" alignItems="center" gap={8} borderRadius={24} backgroundColor="#262629" paddingX={14} paddingY={10}>
        <Search width={16} height={16} opacity={0.6} />
        <Input flexGrow={1} placeholder="Search apps and games" fontSize={13} />
      </Container>

      <Separator />

      <Row>
        <Container flexDirection="row" alignItems="center" gap={10}>
          <Bell width={18} height={18} />
          <Text fontSize={14}>Notifications</Text>
        </Container>
        <Switch checked={notify} onCheckedChange={setNotify} />
      </Row>

      <Container flexDirection="column" gap={8}>
        <Row>
          <Container flexDirection="row" alignItems="center" gap={10}>
            <Volume2 width={18} height={18} />
            <Text fontSize={14}>Volume</Text>
          </Container>
          <Text fontSize={13} opacity={0.6}>
            {`${Math.round(volume)}%`}
          </Text>
        </Row>
        <Slider value={volume} min={0} max={100} step={1} onValueChange={setVolume} />
      </Container>

      <Container flexDirection="column" gap={6}>
        <Row>
          <Text fontSize={13} opacity={0.7}>
            Storage
          </Text>
          <Text fontSize={11} opacity={0.5}>
            48 / 128 GB
          </Text>
        </Row>
        <Progress value={37} height={8} />
      </Container>

      <Container flexDirection="row" gap={10} marginTop={4}>
        <Button variant="secondary" flexGrow={1}>
          <Text fontSize={14}>Cancel</Text>
        </Button>
        <Button flexGrow={1} flexDirection="row" gap={8}>
          <Play width={16} height={16} />
          <Text fontSize={14}>Launch</Text>
        </Button>
      </Container>
    </Card>
  )
}

export const UISampler = () => {
  const showUISampler = useSceneStore((s) => s.showUISampler)
  const modelSize = useSceneStore((s) => s.modelSize)

  if (!showUISampler) return null

  setPreferredColorScheme('dark')

  // Fit the panel within the front face: limit by whichever of width/height is tighter.
  const pixelSize = Math.min((modelSize.x * FACE_FILL) / PANEL_WIDTH, (modelSize.y * FACE_FILL) / PANEL_HEIGHT)

  return (
    <group position={[0, modelSize.y / 2, modelSize.z / 2 + FRONT_GAP]}>
      <Root pixelSize={pixelSize} flexDirection="column" alignItems="center" depthTest={false}>
        <SamplerPanel />
      </Root>
    </group>
  )
}
