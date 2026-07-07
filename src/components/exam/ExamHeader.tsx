import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useExamStore } from '@/store/examStore'
import { formatTime } from '@/utils/examHelpers'
import { getPaperLabel } from '@/utils/paperData'
import { cn } from '@/utils/cn'

export function ExamHeader() {
  const year = useExamStore((s) => s.year)
  const paper = useExamStore((s) => s.paper)
  const remainingTime = useExamStore((s) => s.remainingTime)
  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex)
  const totalQuestions = useExamStore((s) => s.totalQuestions)

  const isLowTime = remainingTime <= 300

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-gray-900 sm:text-lg dark:text-gray-100">
          UPSC CMS Examination
        </h1>
        <p className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
          {year} &middot; {getPaperLabel(paper)}
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Badge variant="blue" className="shrink-0 text-xs sm:text-sm">
          Q {currentQuestionIndex + 1}/{totalQuestions}
        </Badge>
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-3 py-2 font-mono text-sm font-semibold sm:gap-2 sm:px-4 sm:text-lg',
            isLowTime
              ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
          )}
          aria-live="polite"
          aria-label={`Remaining time: ${formatTime(remainingTime)}`}
        >
          <Clock
            className={cn(
              'h-4 w-4 sm:h-5 sm:w-5',
              isLowTime
                ? 'text-red-600 dark:text-red-400'
                : 'text-blue-600 dark:text-blue-400',
            )}
          />
          {formatTime(remainingTime)}
        </div>
      </div>
    </div>
  )
}
