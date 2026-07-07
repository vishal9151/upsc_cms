import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useExamStore, useIsExamReadOnly } from '@/store/examStore'
import { cn } from '@/utils/cn'

interface SubmitTestButtonProps {
  className?: string
  compact?: boolean
}

export function SubmitTestButton({ className, compact }: SubmitTestButtonProps) {
  const openSubmitModal = useExamStore((s) => s.openSubmitModal)
  const isReadOnly = useIsExamReadOnly()

  return (
    <Button
      onClick={openSubmitModal}
      disabled={isReadOnly}
      className={cn('min-h-11 shrink-0', className)}
    >
      {compact ? (
        <>
          <Send className="h-4 w-4" aria-hidden="true" />
          Submit
        </>
      ) : (
        'Submit Test'
      )}
    </Button>
  )
}
