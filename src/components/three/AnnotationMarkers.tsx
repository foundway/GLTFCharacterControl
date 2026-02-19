import { Html } from '@react-three/drei'
import { useAnnotationStore } from '@/store/AnnotationStore'

const MARKER_SIZE_PX = 36
const PANEL_BUTTON_BG = '#2E3033'

const SingleMarker = ({
  position,
  index,
  onSelect,
}: {
  position: [number, number, number]
  index: number
  onSelect: () => void
}) => (
  <Html position={position} center style={{ pointerEvents: 'auto' }} zIndexRange={[0, 0]}>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      style={{
        width: MARKER_SIZE_PX,
        height: MARKER_SIZE_PX,
        minWidth: MARKER_SIZE_PX,
        minHeight: MARKER_SIZE_PX,
        padding: 0,
        margin: 0,
        border: 'none',
        borderRadius: 18,
        background: PANEL_BUTTON_BG,
        color: 'white',
        fontSize: 16,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      {index}
    </button>
  </Html>
)

export const AnnotationMarkers = () => {
  const currentModelUrl = useAnnotationStore((s) => s.currentModelUrl)
  const getAnnotations = useAnnotationStore((s) => s.getAnnotations)
  const setOpenViewForId = useAnnotationStore((s) => s.setOpenViewForId)
  const annotations = currentModelUrl ? getAnnotations(currentModelUrl) : []

  if (annotations.length === 0) return null

  return (
    <>
      {annotations.map((ann, i) => (
        <SingleMarker
          key={ann.id}
          position={ann.position}
          index={i + 1}
          onSelect={() => setOpenViewForId(ann.id)}
        />
      ))}
    </>
  )
}
