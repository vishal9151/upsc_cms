import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button } from '@/components/ui/Button'

interface ConfirmModalProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <ResponsiveModal
      open={open}
      onClose={onCancel}
      titleId="confirm-modal-title"
      centered
    >
      <h2
        id="confirm-modal-title"
        className="text-xl font-bold text-gray-900 dark:text-gray-100"
      >
        {title}
      </h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onCancel} className="min-h-11">
          {cancelLabel}
        </Button>
        <Button variant="primary" onClick={onConfirm} className="min-h-11">
          {confirmLabel}
        </Button>
      </div>
    </ResponsiveModal>
  )
}
