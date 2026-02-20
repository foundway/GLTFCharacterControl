const MARKER_SIZE_PX = 36
const PANEL_BUTTON_BG = '#2E3033'

export const AnnotationMarkerBadge = ({
  index,
  onSelect,
  offScreen,
}: {
  index: number
  onSelect: () => void
  offScreen?: { angleRad: number }
}) => {
  const isOffScreen = offScreen != null
  const angleDeg = offScreen ? (offScreen.angleRad * 180) / Math.PI : 0
  const sharpCornerOffsetDeg = -135

  return (
    <div
      style={{
        position: 'relative',
        width: MARKER_SIZE_PX,
        height: MARKER_SIZE_PX,
        transform: isOffScreen ? `rotate(${angleDeg + sharpCornerOffsetDeg}deg)` : undefined,
        transformOrigin: 'center center',
      }}
    >
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
          borderRadius: isOffScreen ? '18px 18px 18px 0' : 18,
          background: PANEL_BUTTON_BG,
          color: 'white',
          fontSize: 16,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: isOffScreen ? 0.5 : 1,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            transform: isOffScreen ? `rotate(${-(angleDeg + sharpCornerOffsetDeg)}deg)` : undefined,
            transformOrigin: 'center center',
          }}
        >
          {index}
        </span>
      </button>
    </div>
  )
}
