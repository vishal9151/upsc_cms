import { memo } from 'react'
import type { QuestionResult } from '@/types/result'
import { cn } from '@/utils/cn'

const reviewPaletteStyles: Record<
  QuestionResult['status'],
  string
> = {
  correct:
    'border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300',
  incorrect:
    'border-red-300 bg-red-100 text-red-700 dark:border-red-700 dark:bg-red-950 dark:text-red-300',
  skipped:
    'border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

interface ReviewPaletteProps {
  questionResults: QuestionResult[]
  currentIndex: number
  filteredIndices: number[]
  onSelect: (index: number) => void
}

export const ReviewPalette = memo(function ReviewPalette({
  questionResults,
  currentIndex,
  filteredIndices,
  onSelect,
}: ReviewPaletteProps) {
  const displayIndices =
    filteredIndices.length > 0
      ? filteredIndices
      : questionResults.map((q) => q.index)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-green-200 dark:bg-green-800" />
          Correct
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-red-200 dark:bg-red-800" />
          Wrong
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-gray-200 dark:bg-gray-700" />
          Skipped
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-purple-200 ring-2 ring-purple-400 dark:bg-purple-800" />
          Marked
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {displayIndices.map((index) => {
          const result = questionResults[index]
          if (!result) return null
          const isCurrent = index === currentIndex

          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Review question ${index + 1}, ${result.status}`}
              aria-current={isCurrent ? 'true' : undefined}
              className={cn(
                'flex h-11 min-h-11 w-full items-center justify-center rounded-lg border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                reviewPaletteStyles[result.status],
                result.isMarked && 'ring-2 ring-purple-400',
                isCurrent &&
                  'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900',
              )}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
    </div>
  )
})
