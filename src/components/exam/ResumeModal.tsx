import { useState } from 'react'
import { Clock, FileText } from 'lucide-react'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import type { PersistedExamState } from '@/types/persistence'
import { formatTime } from '@/utils/examHelpers'
import { formatRelativeTime } from '@/utils/formatRelativeTime'

interface ResumeModalProps {
  open: boolean
  savedExam: PersistedExamState
  onContinue: () => void
  onStartAgain: () => void
  onCancel: () => void
}

export function ResumeModal({
  open,
  savedExam,
  onContinue,
  onStartAgain,
  onCancel,
}: ResumeModalProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const answeredCount = Object.keys(savedExam.answers).length

  const handleStartAgain = () => {
    setShowConfirm(true)
  }

  const handleConfirmStartAgain = () => {
    setShowConfirm(false)
    onStartAgain()
  }

  return (
    <>
      <ResponsiveModal
        open={open}
        onClose={onCancel}
        titleId="resume-modal-title"
      >
        <h2
          id="resume-modal-title"
          className="text-xl font-bold text-gray-900 dark:text-gray-100"
        >
          Resume Previous Attempt
        </h2>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {answeredCount} / {savedExam.totalQuestions} answered
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Remaining Time
              </p>
              <p className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                {formatTime(savedExam.remainingTime)}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Last Saved: {formatRelativeTime(savedExam.lastUpdated)}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel} className="min-h-11">
            Cancel
          </Button>
          <Button variant="outline" onClick={handleStartAgain} className="min-h-11">
            Start Again
          </Button>
          <Button onClick={onContinue} className="min-h-11">
            Continue
          </Button>
        </div>
      </ResponsiveModal>

      <ConfirmModal
        open={showConfirm}
        title="Start New Attempt?"
        description="Your previous progress will be permanently deleted. This action cannot be undone."
        confirmLabel="Start New Attempt"
        onConfirm={handleConfirmStartAgain}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  )
}
