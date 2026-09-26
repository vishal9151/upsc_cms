import { Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { BackToExamList } from '@/components/layout/BackToExamList'
import { SubmitTestButton } from '@/components/exam/SubmitTestButton'
import { useExamKeyParam } from '@/hooks/useExamKeyParam'
import { useExamStore } from '@/store/examStore'
import { getExamSubtitle, getExamTitle } from '@/utils/examDisplay'
import { formatTime } from '@/utils/examHelpers'
import { cn } from '@/utils/cn'

function ExamTimerDisplay({
  remainingTime,
  isTimed,
  compact = false,
}: {
  remainingTime: number
  isTimed: boolean
  compact?: boolean
}) {
  const isLowTime = isTimed && remainingTime <= 300

  if (!isTimed) {
    return (
      <Badge variant="gray" className="shrink-0 text-xs">
        Untimed
      </Badge>
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-1 rounded-lg font-mono font-semibold',
        compact ? 'px-2 py-1 text-xs' : 'gap-1.5 rounded-xl px-3 py-2 text-sm sm:gap-2 sm:px-4 sm:text-lg',
        isLowTime
          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
          : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
      )}
      aria-live="polite"
      aria-label={`Remaining time: ${formatTime(remainingTime)}`}
    >
      <Clock
        className={cn(
          compact ? 'h-3.5 w-3.5' : 'h-4 w-4 sm:h-5 sm:w-5',
          isLowTime
            ? 'text-red-600 dark:text-red-400'
            : 'text-blue-600 dark:text-blue-400',
        )}
      />
      {formatTime(remainingTime)}
    </div>
  )
}

export function ExamHeader() {
  const examKey = useExamKeyParam()
  const year = useExamStore((s) => s.year)
  const paper = useExamStore((s) => s.paper)
  const remainingTime = useExamStore((s) => s.remainingTime)
  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex)
  const totalQuestions = useExamStore((s) => s.totalQuestions)
  const isTimed = useExamStore((s) => s.isTimed)

  return (
    <>
      {/* Mobile: single slim bar */}
      <div className="flex items-center justify-between gap-2 sm:hidden">
        <BackToExamList variant="compact" />
        <span className="shrink-0 text-xs font-semibold text-blue-700 dark:text-blue-300">
          Q {currentQuestionIndex + 1}/{totalQuestions}
        </span>
        <ExamTimerDisplay
          remainingTime={remainingTime}
          isTimed={isTimed}
          compact
        />
        <SubmitTestButton compact className="min-h-9 shrink-0 px-3 text-xs" />
      </div>

      {/* Tablet / desktop: full title card */}
      <div className="hidden flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:flex sm:p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-semibold text-gray-900 sm:text-lg dark:text-gray-100">
            {getExamTitle(year, paper, examKey)}
          </h1>
          <p className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
            {getExamSubtitle(year, paper, examKey)}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Badge variant="blue" className="shrink-0 text-xs sm:text-sm">
            Q {currentQuestionIndex + 1}/{totalQuestions}
          </Badge>
          <ExamTimerDisplay remainingTime={remainingTime} isTimed={isTimed} />
        </div>
      </div>
    </>
  )
}
