import { useState, useEffect, useRef } from 'react'

const MARKER_SIZE_PX = 36
const PANEL_BUTTON_BG = '#2E3033'
const TRANSITION_DURATION_MS = 300

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
  const prevIsOffScreenRef = useRef<boolean>(false)
  const [delayedRotationDeg, setDelayedRotationDeg] = useState<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const wasOffScreen = prevIsOffScreenRef.current
    const isNowOnScreen = !isOffScreen && wasOffScreen

    if (isNowOnScreen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setDelayedRotationDeg(0)
        timeoutRef.current = null
      }, TRANSITION_DURATION_MS)
    } else if (isOffScreen) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      const newRotation = angleDeg + sharpCornerOffsetDeg
      setDelayedRotationDeg(newRotation)
    }

    prevIsOffScreenRef.current = isOffScreen

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isOffScreen, angleDeg, sharpCornerOffsetDeg])

  const rotationDeg = isOffScreen ? angleDeg + sharpCornerOffsetDeg : delayedRotationDeg
  const counterRotationDeg = isOffScreen ? -(angleDeg + sharpCornerOffsetDeg) : -delayedRotationDeg

  return (
    <div
      style={{
        position: 'relative',
        width: MARKER_SIZE_PX,
        height: MARKER_SIZE_PX,
        transform: `rotate(${rotationDeg}deg)`,
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
          transition: `opacity ${TRANSITION_DURATION_MS}ms ease-out, border-radius ${TRANSITION_DURATION_MS}ms ease-out`,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            transform: `rotate(${counterRotationDeg}deg)`,
            transformOrigin: 'center center',
          }}
        >
          {index}
        </span>
      </button>
    </div>
  )
}
