import { AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import { Button } from '@/components/ui/Button'
import { useExamSubmission } from '@/hooks/useExamSubmission'
import { useExamStore, useExamStats } from '@/store/examStore'
import { formatTime } from '@/utils/examHelpers'

function getSubmitMessage(
  unansweredCount: number,
  totalQuestions: number,
  answeredCount: number,
  visitedCount: number,
): string | null {
  if (unansweredCount > 0) {
    return `You still have ${unansweredCount} unanswered question${unansweredCount === 1 ? '' : 's'}.\n\nYou may go back and review them or submit your test now.`
  }
  if (answeredCount === totalQuestions) {
    return 'Excellent! Every question has been answered.'
  }
  if (visitedCount === totalQuestions) {
    return 'You have visited every question.'
  }
  return null
}

export function SubmitModal() {
  const showSubmitModal = useExamStore((s) => s.showSubmitModal)
  const closeSubmitModal = useExamStore((s) => s.closeSubmitModal)
  const totalQuestions = useExamStore((s) => s.totalQuestions)
  const remainingTime = useExamStore((s) => s.remainingTime)
  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex)
  const {
    answeredCount,
    unansweredCount,
    reviewCount,
    answeredAndReviewCount,
    visitedCount,
  } = useExamStats()
  const { submitAndNavigate } = useExamSubmission()

  const message = getSubmitMessage(
    unansweredCount,
    totalQuestions,
    answeredCount,
    visitedCount,
  )

  const handleSubmit = () => {
    submitAndNavigate(false)
  }

  return (
    <ResponsiveModal
      open={showSubmitModal}
      onClose={closeSubmitModal}
      titleId="submit-modal-title"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950">
          <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2
          id="submit-modal-title"
          className="text-xl font-bold text-gray-900 dark:text-gray-100"
        >
          Submit Test?
        </h2>
      </div>

      <div className="space-y-2 text-sm">
        {[
          { label: 'Total Questions', value: totalQuestions },
          { label: 'Current Question', value: currentQuestionIndex + 1 },
          { label: 'Answered', value: answeredCount },
          { label: 'Unanswered', value: unansweredCount },
          { label: 'Marked For Review', value: reviewCount },
          { label: 'Answered & Review', value: answeredAndReviewCount },
          { label: 'Remaining Time', value: formatTime(remainingTime), mono: true },
        ].map((row) => (
          <div
            key={row.label}
            className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50"
          >
            <span className="text-gray-600 dark:text-gray-400">{row.label}</span>
            <span
              className={`font-semibold text-gray-900 dark:text-gray-100 ${row.mono ? 'font-mono' : ''}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {message && (
        <p className="mt-4 whitespace-pre-line rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-200">
          {message}
        </p>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={closeSubmitModal} className="min-h-11">
          Go Back To Exam
        </Button>
        <Button onClick={handleSubmit} className="min-h-11">
          Submit Test
        </Button>
      </div>
    </ResponsiveModal>
  )
}

export function TimeUpModal() {
  const showTimeUpModal = useExamStore((s) => s.showTimeUpModal)
  const pendingAutoSubmit = useExamStore((s) => s.pendingAutoSubmit)
  const setPendingAutoSubmit = useExamStore((s) => s.setPendingAutoSubmit)
  const closeTimeUpModal = useExamStore((s) => s.closeTimeUpModal)
  const { submitAndNavigate } = useExamSubmission()

  useEffect(() => {
    if (pendingAutoSubmit) {
      submitAndNavigate(true)
      setPendingAutoSubmit(false)
    }
  }, [pendingAutoSubmit, submitAndNavigate, setPendingAutoSubmit])

  return (
    <ResponsiveModal
      open={showTimeUpModal}
      onClose={closeTimeUpModal}
      titleId="timeup-modal-title"
    >
      <div className="flex flex-col items-center text-center">
        <h2
          id="timeup-modal-title"
          className="text-xl font-bold text-gray-900 dark:text-gray-100"
        >
          Time is Over
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Your test has been submitted automatically.
        </p>
        <Button className="mt-6 min-h-11" onClick={closeTimeUpModal}>
          View Results
        </Button>
      </div>
    </ResponsiveModal>
  )
}
