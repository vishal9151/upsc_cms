import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw } from 'lucide-react'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { useExamStore } from '@/store/examStore'
import { clearAllAppData } from '@/utils/appStorage'
import { cn } from '@/utils/cn'

export function ClearDataButton() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    clearAllAppData()
    useExamStore.getState().reset()
    setOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Clear all saved progress"
        title="Clear all saved progress"
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800',
        )}
      >
        <RotateCcw className="h-5 w-5" />
      </button>

      <ConfirmModal
        open={open}
        title="Clear All Saved Data?"
        description="This removes all in-progress exams, submitted results, practice tests, and attempt history from this browser. Your theme preference is kept. This cannot be undone."
        confirmLabel="Clear Everything"
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
