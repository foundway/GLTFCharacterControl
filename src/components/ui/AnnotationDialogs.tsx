import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, X } from 'lucide-react'
import { useAnnotationStore } from '@/store/AnnotationStore'
import { useModels } from '@/context/AppContext'

const overlayStyle =
  'fixed inset-0 bg-black/50 flex items-center justify-center z-50 pointer-events-auto'
const cardStyle =
  'bg-control text-white rounded-[2px] p-4 shadow-lg min-w-[280px] max-w-[90vw] flex flex-col gap-3'

export const AnnotationDialogs = () => {
  const { currentModel } = useModels()
  const {
    getAnnotations,
    openInputForId,
    openViewForId,
    setOpenInputForId,
    setOpenViewForId,
    update,
    remove,
  } = useAnnotationStore()
  const annotations = getAnnotations(currentModel.url)
  const inputAnnotation = annotations.find((a) => a.id === openInputForId)
  const viewAnnotation = annotations.find((a) => a.id === openViewForId)

  const [editText, setEditText] = useState('')
  const [editingViewId, setEditingViewId] = useState<string | null>(null)
  const [aiAssistLoading, setAiAssistLoading] = useState(false)
  const aiAssistTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearAiAssistTimeout = () => {
    if (aiAssistTimeoutRef.current) {
      clearTimeout(aiAssistTimeoutRef.current)
      aiAssistTimeoutRef.current = null
    }
  }

  useEffect(() => {
    if (openInputForId) {
      const a = annotations.find((x) => x.id === openInputForId)
      setEditText(a?.text ?? '')
    }
  }, [openInputForId, annotations])

  useEffect(() => {
    clearAiAssistTimeout()
    setAiAssistLoading(false)
  }, [openInputForId])

  useEffect(() => () => clearAiAssistTimeout(), [])

  const handleAiAssistClick = () => {
    if (aiAssistLoading) return
    setAiAssistLoading(true)
    clearAiAssistTimeout()
    aiAssistTimeoutRef.current = setTimeout(() => {
      setEditText('A blue vehicle')
      setAiAssistLoading(false)
      aiAssistTimeoutRef.current = null
    }, 1000)
  }

  useEffect(() => {
    if (openViewForId) {
      const a = annotations.find((x) => x.id === openViewForId)
      setEditText(a?.text ?? '')
      setEditingViewId(null)
    }
  }, [openViewForId, annotations])

  const handleInputSubmit = () => {
    clearAiAssistTimeout()
    setAiAssistLoading(false)
    if (openInputForId) {
      update(currentModel.url, openInputForId, editText)
      setOpenInputForId(null)
    }
  }

  const handleInputCancel = () => {
    clearAiAssistTimeout()
    setAiAssistLoading(false)
    if (openInputForId) {
      remove(currentModel.url, openInputForId)
    }
    setOpenInputForId(null)
  }

  const handleViewClose = () => {
    setOpenViewForId(null)
    setEditingViewId(null)
  }

  const handleViewEdit = () => {
    if (openViewForId) setEditingViewId(openViewForId)
  }

  const handleViewEditSubmit = () => {
    if (editingViewId) {
      update(currentModel.url, editingViewId, editText)
      setEditingViewId(null)
    }
  }

  const handleViewDelete = () => {
    if (openViewForId) {
      remove(currentModel.url, openViewForId)
      setOpenViewForId(null)
    }
  }

  const showInput = openInputForId && inputAnnotation
  const showView = openViewForId && viewAnnotation && !editingViewId
  const showViewEditing = openViewForId && viewAnnotation && editingViewId

  return (
    <>
      {showInput && (
        <div className={overlayStyle} onClick={(e) => e.target === e.currentTarget && handleInputCancel()}>
          <div className={cardStyle} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold">Annotation</h3>
              <button
                type="button"
                className="shrink-0 h-8 w-8 flex items-center justify-center rounded-[8px] bg-[#2E3033] text-white hover:bg-[#3d4045] hover:text-white cursor-pointer transition-colors disabled:opacity-70"
                disabled={aiAssistLoading}
                aria-label={aiAssistLoading ? 'Generating…' : 'AI-assisted annotation'}
                aria-busy={aiAssistLoading}
                onClick={handleAiAssistClick}
              >
                {aiAssistLoading ? (
                  <Loader2 size={18} strokeWidth={1.75} className="animate-spin" />
                ) : (
                  <Sparkles size={18} strokeWidth={1.75} />
                )}
              </button>
            </div>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 bg-[#2E3033] text-white rounded-[2px] border-none text-sm resize-y"
              placeholder="Enter annotation text..."
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#2E3033] text-white hover:bg-[#3d4045] cursor-pointer"
                onClick={handleInputCancel}
              >
                Cancel
              </Button>
              <Button size="sm" className="cursor-pointer" onClick={handleInputSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {showView && (
        <div className={overlayStyle} onClick={(e) => e.target === e.currentTarget && handleViewClose()}>
          <div className={cardStyle} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">Annotation</h3>
              <button
                type="button"
                onClick={handleViewClose}
                className="text-gray-400 hover:text-white cursor-pointer p-1 -mt-1 -mr-1 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
              {viewAnnotation.text || '(No text)'}
            </p>
            <div className="flex gap-2 justify-end flex-wrap">
              <Button size="sm" variant="secondary" className="bg-[#2E3033] text-white hover:bg-[#3d4045] cursor-pointer" onClick={handleViewEdit}>
                Edit
              </Button>
              <Button size="sm" variant="destructive" className="cursor-pointer" onClick={handleViewDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {showViewEditing && (
        <div className={overlayStyle} onClick={(e) => e.target === e.currentTarget && setEditingViewId(null)}>
          <div className={cardStyle} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold">Edit annotation</h3>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 bg-[#2E3033] text-white rounded-[2px] border-none text-sm resize-y"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                size="sm"
                className="bg-[#2E3033] text-white hover:bg-[#3d4045] cursor-pointer"
                onClick={() => setEditingViewId(null)}
              >
                Cancel
              </Button>
              <Button size="sm" className="cursor-pointer" onClick={handleViewEditSubmit}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
