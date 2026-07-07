import { memo } from 'react'
import type { Question } from '@/types/exam'
import type { QuestionResult } from '@/types/result'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import {
  formatExplanationText,
  formatOptionText,
  formatQuestionText,
} from '@/utils/textFormatter'

interface ReviewQuestionCardProps {
  question: Question
  result: QuestionResult
}

export const ReviewQuestionCard = memo(function ReviewQuestionCard({
  question,
  result,
}: ReviewQuestionCardProps) {
  const statusLabels = {
    correct: { label: 'Correct', variant: 'green' as const },
    incorrect: { label: 'Incorrect', variant: 'red' as const },
    skipped: { label: 'Skipped', variant: 'gray' as const },
  }
  const status = statusLabels[result.status]

  return (
    <Card>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {result.index + 1}
            </span>
            <p className="whitespace-pre-line text-base leading-relaxed text-gray-900 dark:text-gray-100">
              {formatQuestionText(question.question)}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>
            {result.isMarked && <Badge variant="purple">Marked</Badge>}
          </div>
        </div>

        <div className="space-y-3" role="list" aria-label="Answer options">
          {question.options.map((option, index) => {
            const isCorrect = index === question.correctAnswer
            const isUserAnswer = result.userAnswer === index
            const isWrongSelection = isUserAnswer && !isCorrect

            return (
              <div
                key={option}
                role="listitem"
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-4',
                  isCorrect &&
                    'border-green-500 bg-green-50 dark:border-green-600 dark:bg-green-950/50',
                  isWrongSelection &&
                    'border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-950/50',
                  !isCorrect &&
                    !isWrongSelection &&
                    'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
                    isCorrect &&
                      'border-green-600 bg-green-600 text-white dark:border-green-400 dark:bg-green-500',
                    isWrongSelection &&
                      'border-red-600 bg-red-600 text-white dark:border-red-400 dark:bg-red-500',
                    !isCorrect &&
                      !isWrongSelection &&
                      'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400',
                  )}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formatOptionText(option)}
                </span>
                {isCorrect && (
                  <Badge variant="green" className="ml-auto">
                    Correct Answer
                  </Badge>
                )}
                {isWrongSelection && (
                  <Badge variant="red" className="ml-auto">
                    Your Answer
                  </Badge>
                )}
              </div>
            )
          })}
        </div>

        {question.explanation && (
          <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/50">
            <h3 className="mb-2 text-sm font-semibold text-blue-900 dark:text-blue-200">
              Explanation
            </h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-blue-800 dark:text-blue-300">
              {formatExplanationText(question.explanation)}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
})
