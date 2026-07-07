import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Eraser,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  useExamStore,
  useCurrentAnswer,
  useIsMarkedForReview,
  useIsExamReadOnly,
} from '@/store/examStore'
import { cn } from '@/utils/cn'

export function ExamNavigation() {
  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex)
  const totalQuestions = useExamStore((s) => s.totalQuestions)
  const goPrevious = useExamStore((s) => s.goPrevious)
  const goNext = useExamStore((s) => s.goNext)
  const clearResponse = useExamStore((s) => s.clearResponse)
  const toggleMarkForReview = useExamStore((s) => s.toggleMarkForReview)
  const isMarked = useIsMarkedForReview()
  const currentAnswer = useCurrentAnswer()
  const isReadOnly = useIsExamReadOnly()

  const isFirst = currentQuestionIndex === 0
  const isLast = currentQuestionIndex === totalQuestions - 1

  return (
    <div className="sticky bottom-0 z-20 -mx-4 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95 sm:-mx-0 sm:rounded-xl sm:border sm:px-4">
      {/* Desktop / Tablet */}
      <div className="hidden items-center justify-between gap-2 md:flex">
        <Button
          variant="outline"
          disabled={isFirst || isReadOnly}
          onClick={goPrevious}
          className="min-h-11 shrink-0"
        >
          Previous
        </Button>
        <div className="flex items-center gap-2 lg:gap-3">
          <Button
            variant="ghost"
            onClick={clearResponse}
            disabled={isReadOnly || currentAnswer === undefined}
            className="min-h-11 shrink-0 px-3 lg:px-5"
          >
            <span className="hidden lg:inline">Clear Response</span>
            <span className="lg:hidden">Clear</span>
          </Button>
          <Button
            variant="secondary"
            onClick={toggleMarkForReview}
            disabled={isReadOnly}
            className={cn(
              'min-h-11 shrink-0 px-3 lg:px-5',
              isMarked && 'ring-2 ring-purple-400',
            )}
            aria-pressed={isMarked}
          >
            <span className="hidden lg:inline">
              {isMarked ? 'Unmark Review' : 'Mark for Review'}
            </span>
            <span className="lg:hidden">{isMarked ? 'Unmark' : 'Review'}</span>
          </Button>
          <Button
            onClick={goNext}
            disabled={isReadOnly || isLast}
            className="min-h-11 shrink-0"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Mobile */}
      <div className="grid grid-cols-3 gap-2 md:hidden">
        <Button
          variant="outline"
          disabled={isFirst || isReadOnly}
          onClick={goPrevious}
          className="min-h-11 flex-col gap-1 px-2 py-2 text-xs"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={toggleMarkForReview}
          disabled={isReadOnly}
          className={cn(
            'min-h-11 flex-col gap-1 px-2 py-2 text-xs',
            isMarked && 'ring-2 ring-purple-400',
          )}
          aria-pressed={isMarked}
        >
          <Bookmark className="h-4 w-4" />
          Review
        </Button>
        <Button
          onClick={goNext}
          disabled={isReadOnly || isLast}
          className="min-h-11 flex-col gap-1 px-2 py-2 text-xs"
        >
          <ChevronRight className="h-4 w-4" />
          Next
        </Button>
      </div>

      {/* Mobile: Clear Response as secondary row */}
      <div className="mt-2 md:hidden">
        <Button
          variant="ghost"
          onClick={clearResponse}
          disabled={isReadOnly || currentAnswer === undefined}
          className="min-h-11 w-full text-xs"
        >
          <Eraser className="mr-1 h-4 w-4" />
          Clear Response
        </Button>
      </div>
    </div>
  )
}
