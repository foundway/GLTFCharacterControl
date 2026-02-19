import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useAnnotationStore } from '@/store/AnnotationStore'
import { useMeasurementStore } from '@/store/MeasurementStore'
import { useModels } from '@/context/AppContext'
import { HiOutlineAnnotation } from 'react-icons/hi'

const panelStyle = 'bg-control text-white rounded-[2px] border-none'

export const PanelAnnotationMenu = () => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentModel } = useModels()
  const { getAnnotations, setPlacing, setCurrentModelUrl, setFlyToAnnotationId } = useAnnotationStore()
  const annotations = getAnnotations(currentModel.url)

  useEffect(() => {
    setCurrentModelUrl(currentModel.url)
    return () => setCurrentModelUrl(null)
  }, [currentModel.url, setCurrentModelUrl])

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

  const handleAddAnnotation = () => {
    useMeasurementStore.getState().setMeasurementMode(false)
    setPlacing(true)
    setOpen(false)
  }

  const handleAnnotationItemClick = (annotationId: string) => {
    setFlyToAnnotationId(annotationId)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        className={`${panelStyle} w-[40px] h-[40px] p-0 flex items-center justify-center hover:bg-[#2E3033] cursor-pointer`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <HiOutlineAnnotation size={20} />
      </Button>
      {open && (
        <div
          className={`${panelStyle} px-0 py-2 flex flex-col gap-0 min-w-[160px] shadow-lg absolute right-[44px] top-0`}
        >
          <Button
            className={`${panelStyle} h-9 px-3 hover:bg-[#2E3033] cursor-pointer text-sm w-full justify-start rounded-[0px]`}
            onClick={handleAddAnnotation}
          >
            Add annotation
          </Button>
          {annotations.length > 0 && (
            <>
              <div className="my-1 border-t border-white/20 w-full" />
              {annotations.map((ann, i) => (
                <Button
                  key={ann.id}
                  className={`${panelStyle} h-9 px-3 hover:bg-[#2E3033] cursor-pointer text-sm w-full justify-start rounded-[0px] text-left truncate`}
                  onClick={() => handleAnnotationItemClick(ann.id)}
                >
                  {i + 1} · {ann.text ? `${ann.text.slice(0, 20)}${ann.text.length > 20 ? '…' : ''}` : ''}
                </Button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
