import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useSceneStore } from '@/store/SceneStore'
import { LuShapes } from 'react-icons/lu'

const panelStyle = 'bg-control text-white rounded-[2px] border-none'
const sliderStyle =
  'w-full h-2 bg-[#2E3033] rounded appearance-none cursor-pointer accent-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white'

export const PanelGeometryMenu = () => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { pointScale, pointDisplayPercent, cameraNear, setPointScale, setPointDisplayPercent, setCameraNear } = useSceneStore()

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (containerRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <Button
        className={`${panelStyle} w-[40px] h-[40px] p-0 flex items-center justify-center hover:bg-[#2E3033] cursor-pointer`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <LuShapes size={20} />
      </Button>
      {open && (
        <div
          className={`${panelStyle} px-3 py-3 flex flex-col gap-3 min-w-[180px] shadow-lg absolute right-[44px] top-0`}
        >
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="flex justify-between">
              <span>Point scale</span>
              <span className="text-gray-400 tabular-nums">{pointScale.toFixed(1)}</span>
            </span>
            <input
              type="range"
              min={0.1}
              max={10}
              step={0.1}
              value={pointScale}
              onChange={(e) => setPointScale(Number(e.target.value))}
              className={sliderStyle}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="flex justify-between">
              <span>Point %</span>
              <span className="text-gray-400 tabular-nums">{pointDisplayPercent.toFixed(1)}%</span>
            </span>
            <input
              type="range"
              min={0.01}
              max={100}
              step={0.01}
              value={pointDisplayPercent}
              onChange={(e) => setPointDisplayPercent(Number(e.target.value))}
              className={sliderStyle}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="flex justify-between">
              <span>Clipping</span>
              <span className="text-gray-400 tabular-nums">{cameraNear.toFixed(1)}</span>
            </span>
            <input
              type="range"
              min={0.1}
              max={100}
              step={0.1}
              value={cameraNear}
              onChange={(e) => setCameraNear(Number(e.target.value))}
              className={sliderStyle}
            />
          </label>
        </div>
      )}
    </div>
  )
}
