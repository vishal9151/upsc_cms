import { memo, useMemo, useState } from 'react'
import type { QuestionResult, ReviewFilter } from '@/types/result'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const FILTERS: { id: ReviewFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'correct', label: 'Correct' },
  { id: 'incorrect', label: 'Incorrect' },
  { id: 'skipped', label: 'Skipped' },
  { id: 'marked', label: 'Marked' },
  { id: 'answered', label: 'Answered' },
]

function matchesFilter(result: QuestionResult, filter: ReviewFilter): boolean {
  switch (filter) {
    case 'all':
      return true
    case 'correct':
      return result.status === 'correct'
    case 'incorrect':
      return result.status === 'incorrect'
    case 'skipped':
      return result.status === 'skipped'
    case 'marked':
      return result.isMarked
    case 'answered':
      return result.userAnswer !== null
    default:
      return true
  }
}

const statusBadge: Record<
  QuestionResult['status'],
  { variant: 'green' | 'gray' | 'red'; label: string }
> = {
  correct: { variant: 'green', label: 'Correct' },
  incorrect: { variant: 'red', label: 'Incorrect' },
  skipped: { variant: 'gray', label: 'Skipped' },
}

interface QuestionAnalysisProps {
  questionResults: QuestionResult[]
  onQuestionClick: (index: number) => void
}

export const QuestionAnalysis = memo(function QuestionAnalysis({
  questionResults,
  onQuestionClick,
}: QuestionAnalysisProps) {
  const [filter, setFilter] = useState<ReviewFilter>('all')

  const filtered = useMemo(
    () => questionResults.filter((q) => matchesFilter(q, filter)),
    [questionResults, filter],
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={filter === f.id ? 'primary' : 'outline'}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <Card>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
          Question Analysis ({filtered.length})
        </h3>
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No questions match this filter.
            </p>
          ) : (
            filtered.map((result) => {
              const badge = statusBadge[result.status]
              return (
                <button
                  key={result.index}
                  type="button"
                  onClick={() => onQuestionClick(result.index)}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-sm font-semibold dark:bg-gray-800">
                      {result.index + 1}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Question {result.index + 1}
                    </span>
                    {result.isMarked && (
                      <Badge variant="purple">Marked</Badge>
                    )}
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </button>
              )
            })
          )}
        </div>
      </Card>
    </div>
  )
})
