import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BackToExamList } from '@/components/layout/BackToExamList'
import { BackToResults } from '@/components/layout/BackToResults'
import { ReviewMobilePalette } from '@/components/review/ReviewMobilePalette'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ReviewPalette } from '@/components/review/ReviewPalette'
import { ReviewQuestionCard } from '@/components/review/ReviewQuestionCard'
import type { ReviewFilter } from '@/types/result'
import { useExamResult } from '@/hooks/useExamResult'
import { getPaperLabel } from '@/utils/paperData'

const FILTERS: { id: ReviewFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'correct', label: 'Correct' },
  { id: 'incorrect', label: 'Incorrect' },
  { id: 'skipped', label: 'Skipped' },
  { id: 'marked', label: 'Marked' },
  { id: 'answered', label: 'Answered' },
]

function matchesFilter(
  result: { status: string; isMarked: boolean; userAnswer: number | null },
  filter: ReviewFilter,
): boolean {
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

export function Review() {
  const data = useExamResult()
  const location = useLocation()
  const initialIndex =
    (location.state as { questionIndex?: number } | null)?.questionIndex ?? 0

  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [filter, setFilter] = useState<ReviewFilter>('all')

  const filteredIndices = useMemo(() => {
    if (!data) return []
    return data.questionResults
      .filter((q) => matchesFilter(q, filter))
      .map((q) => q.index)
  }, [data, filter])

  const navigableIndices = useMemo(() => {
    if (filteredIndices.length > 0) return filteredIndices
    return data?.questionResults.map((q) => q.index) ?? []
  }, [filteredIndices, data])

  const currentPosition = navigableIndices.indexOf(currentIndex)
  const effectiveIndex =
    currentPosition >= 0 ? currentIndex : navigableIndices[0] ?? 0

  if (!data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No review data found. Complete an exam first.
        </p>
        <Link to="/">
          <Button variant="outline">
            <Home className="h-4 w-4" />
            Back Home
          </Button>
        </Link>
      </div>
    )
  }

  const { questions, questionResults, year, paper } = data
  const currentResult = questionResults[effectiveIndex]
  const currentQuestion = questions[effectiveIndex]

  if (!currentResult || !currentQuestion) return null

  const pos = navigableIndices.indexOf(effectiveIndex)
  const canGoPrev = pos > 0
  const canGoNext = pos < navigableIndices.length - 1

  const goPrev = () => {
    if (canGoPrev) setCurrentIndex(navigableIndices[pos - 1])
  }

  const goNext = () => {
    if (canGoNext) setCurrentIndex(navigableIndices[pos + 1])
  }

  const handleFilterChange = (newFilter: ReviewFilter) => {
    setFilter(newFilter)
    const newFiltered = data.questionResults
      .filter((q) => matchesFilter(q, newFilter))
      .map((q) => q.index)
    if (newFiltered.length > 0 && !newFiltered.includes(currentIndex)) {
      setCurrentIndex(newFiltered[0])
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between gap-3">
        <BackToExamList variant="header" />
        <BackToResults year={year} paper={paper} variant="header" />
      </div>
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <BackToExamList variant="below" />
        <BackToResults year={year} paper={paper} variant="below" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Review Answers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {year} &middot; {getPaperLabel(paper)}
          </p>
        </div>
        <Badge variant="blue">
          Question {effectiveIndex + 1} of {questions.length}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={filter === f.id ? 'primary' : 'outline'}
            onClick={() => handleFilterChange(f.id)}
            aria-pressed={filter === f.id}
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <ReviewQuestionCard
            question={currentQuestion}
            result={currentResult}
          />
          <div className="flex items-center justify-between">
            <Button variant="outline" disabled={!canGoPrev} onClick={goPrev}>
              Previous
            </Button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {pos + 1} of {navigableIndices.length}
            </span>
            <Button disabled={!canGoNext} onClick={goNext}>
              Next
            </Button>
          </div>
        </div>

        <aside className="hidden lg:sticky lg:top-24 lg:block lg:w-72 lg:self-start">
          <Card>
            <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
              Question Palette
            </h2>
            <ReviewPalette
              questionResults={data.questionResults}
              currentIndex={effectiveIndex}
              filteredIndices={filteredIndices}
              onSelect={setCurrentIndex}
            />
          </Card>
        </aside>
      </div>

      <ReviewMobilePalette
        questionResults={data.questionResults}
        currentIndex={effectiveIndex}
        filteredIndices={filteredIndices}
        onSelect={setCurrentIndex}
      />

      <div className="flex justify-center gap-3">
        <Link to={`/result/${year}/${paper}`}>
          <Button variant="outline">Back to Results</Button>
        </Link>
        <Link to="/">
          <Button variant="ghost">
            <Home className="h-4 w-4" />
            Back Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
