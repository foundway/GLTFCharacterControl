import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSceneStore, Environments } from '@/store/SceneStore'
import { MdOutlineVrpano } from 'react-icons/md'

const panelStyle = 'bg-control text-white rounded-[2px] border-none'

export const PanelEnvironmentMenu = () => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (!containerRef.current) return
      
      if (containerRef.current.contains(target)) {
        return
      }
      
      const selectContent = document.querySelector('[data-slot="select-content"]')
      if (selectContent && selectContent.contains(target)) {
        return
      }
      
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const { setEnvironment, currentEnvironment, showBackground, toggleBackground, showGrid, toggleGrid } = useSceneStore()

  const currentEnvironmentName = showBackground 
    ? Object.entries(Environments).find(([_, url]) => url === currentEnvironment)?.[0] || 'None'
    : 'None'

  const handleEnvironmentChange = (value: string) => {
    if (value === 'none') {
      if (showBackground) {
        toggleBackground()
      }
    } else {
      const environmentUrl = Environments[value as keyof typeof Environments]
      if (environmentUrl) {
        setEnvironment(environmentUrl)
        if (!showBackground) {
          toggleBackground()
        }
      }
    }
  }

  return (
    <div ref={containerRef} className="absolute top-2 right-2" style={{ top: '56px' }}>
      <Button
        className={`${panelStyle} w-[40px] h-[40px] p-0 flex items-center justify-center hover:bg-[#2E3033] cursor-pointer`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <MdOutlineVrpano size={20} />
      </Button>
      {open && (
        <div className={`${panelStyle} px-0 py-2 flex flex-col gap-2 min-w-[160px] shadow-lg absolute right-[44px] top-0`}>
          <Select 
            value={showBackground ? currentEnvironmentName : 'none'} 
            onValueChange={handleEnvironmentChange}
          >
            <SelectTrigger className="model-select-trigger bg-control text-white rounded-[2px] border-none p-3 h-[40px] hover:bg-[#2E3033] transition-colors cursor-pointer w-full">
              <SelectValue placeholder="Environment" />
            </SelectTrigger>
            <SelectContent side="left" sideOffset={1} className="bg-control text-white rounded-[2px] border-none px-0 py-2">
              <SelectGroup>
                <SelectItem 
                  value="none"
                  className="hover:bg-[#2E3033] focus:bg-[#2E3033] focus:text-white cursor-pointer transition-colors rounded-[0px] px-3 y-2 text-white"
                >
                  None
                </SelectItem>
                {Object.keys(Environments).map((name) => (
                  <SelectItem 
                    key={name} 
                    value={name}
                    className="hover:bg-[#2E3033] focus:bg-[#2E3033] focus:text-white cursor-pointer transition-colors rounded-[0px] px-3 py-2 text-white"
                  >
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button
            className={`${panelStyle} h-9 px-3 hover:bg-[#2E3033] cursor-pointer text-sm w-full justify-start`}
            onClick={toggleGrid}
          >
            {showGrid ? 'Hide Grid' : 'Show Grid'}
          </Button>
        </div>
      )}
    </div>
  )
}