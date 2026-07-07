import { motion } from 'framer-motion'
import { useExamStore, useExamStats } from '@/store/examStore'
import { Card } from '@/components/ui/Card'
import { QuestionPalette } from '@/components/exam/QuestionPalette'
import { cn } from '@/utils/cn'

export function ExamSidebar() {
  const {
    answeredCount,
    visitedCount,
    reviewCount,
    remainingCount,
  } = useExamStats()

  const stats = [
    {
      label: 'Answered',
      value: answeredCount,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Visited',
      value: visitedCount,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Review',
      value: reviewCount,
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: 'Remaining',
      value: remainingCount,
      color: 'text-gray-600 dark:text-gray-400',
    },
  ]

  return (
    <aside className="hidden w-60 shrink-0 lg:sticky lg:top-24 lg:block lg:w-72 lg:self-start">
      <Card className="space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
          Question Palette
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <QuestionPalette />
      </Card>
    </aside>
  )
}

export function ExamProgress({ className }: { className?: string }) {
  const { answeredCount, visitedCount, remainingCount, progressPercent } =
    useExamStats()
  const totalQuestions = useExamStore((s) => s.totalQuestions)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300">
          Progress
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          {progressPercent}% ({answeredCount}/{totalQuestions} answered)
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Exam progress"
      >
        <motion.div
          className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
          initial={false}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
      <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
        <span>Answered: {answeredCount}</span>
        <span>Visited: {visitedCount}</span>
        <span>Remaining: {remainingCount}</span>
      </div>
    </div>
  )
}
