import { motion } from 'framer-motion'
import { useExamStore } from '@/store/examStore'
import {
  getQuestionStatus,
  paletteLegendItems,
  paletteStatusStyles,
} from '@/utils/examHelpers'
import { cn } from '@/utils/cn'

export function QuestionPalette({ onNavigate }: { onNavigate?: () => void }) {
  const totalQuestions = useExamStore((s) => s.totalQuestions)
  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex)
  const visitedQuestions = useExamStore((s) => s.visitedQuestions)
  const answers = useExamStore((s) => s.answers)
  const markedForReview = useExamStore((s) => s.markedForReview)
  const goToQuestion = useExamStore((s) => s.goToQuestion)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {paletteLegendItems.map((item) => (
          <div
            key={item.status}
            className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400"
          >
            <span className={cn('h-3 w-3 rounded', item.swatchClass)} />
            {item.label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const status = getQuestionStatus(
            index,
            visitedQuestions,
            answers,
            markedForReview,
          )
          const isCurrent = index === currentQuestionIndex

          return (
            <motion.button
              key={index}
              type="button"
              layout
              onClick={() => {
                goToQuestion(index)
                onNavigate?.()
              }}
              aria-label={`Go to question ${index + 1}`}
              aria-current={isCurrent ? 'true' : undefined}
              className={cn(
                'flex h-11 min-h-11 w-full items-center justify-center rounded-lg border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                paletteStatusStyles[status],
                isCurrent &&
                  'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900',
              )}
            >
              {index + 1}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
