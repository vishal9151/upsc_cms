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
    <div className="sticky bottom-0 z-20 -mx-4 border-t border-gray-200 bg-white/95 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95 sm:mx-0 sm:rounded-xl sm:border sm:px-4 sm:py-3 sm:pb-3">
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

      {/* Mobile: single row */}
      <div className="grid grid-cols-4 gap-1.5 md:hidden">
        <Button
          variant="outline"
          disabled={isFirst || isReadOnly}
          onClick={goPrevious}
          className="min-h-11 flex-col gap-0.5 px-1 py-1.5 text-[10px]"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <Button
          variant="secondary"
          onClick={toggleMarkForReview}
          disabled={isReadOnly}
          className={cn(
            'min-h-11 flex-col gap-0.5 px-1 py-1.5 text-[10px]',
            isMarked && 'ring-2 ring-purple-400',
          )}
          aria-pressed={isMarked}
        >
          <Bookmark className="h-4 w-4" />
          Mark
        </Button>
        <Button
          variant="ghost"
          onClick={clearResponse}
          disabled={isReadOnly || currentAnswer === undefined}
          className="min-h-11 flex-col gap-0.5 px-1 py-1.5 text-[10px]"
        >
          <Eraser className="h-4 w-4" />
          Clear
        </Button>
        <Button
          onClick={goNext}
          disabled={isReadOnly || isLast}
          className="min-h-11 flex-col gap-0.5 px-1 py-1.5 text-[10px]"
        >
          <ChevronRight className="h-4 w-4" />
          Next
        </Button>
      </div>
    </div>
  )
}
