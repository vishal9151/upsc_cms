import { useEffect } from 'react'
import { useExamStore } from '@/store/examStore'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

export function useExamKeyboard() {
  const goNext = useExamStore((s) => s.goNext)
  const goPrevious = useExamStore((s) => s.goPrevious)
  const selectAnswer = useExamStore((s) => s.selectAnswer)
  const clearResponse = useExamStore((s) => s.clearResponse)
  const toggleMarkForReview = useExamStore((s) => s.toggleMarkForReview)
  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex)
  const totalQuestions = useExamStore((s) => s.totalQuestions)
  const openSubmitModal = useExamStore((s) => s.openSubmitModal)
  const examCompleted = useExamStore((s) => s.examCompleted)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (examCompleted || isTypingTarget(event.target)) return

      switch (event.key) {
        case '1':
          selectAnswer(0)
          break
        case '2':
          selectAnswer(1)
          break
        case '3':
          selectAnswer(2)
          break
        case '4':
          selectAnswer(3)
          break
        case 'ArrowRight':
          event.preventDefault()
          if (currentQuestionIndex < totalQuestions - 1) {
            goNext()
          }
          break
        case 'ArrowLeft':
          event.preventDefault()
          goPrevious()
          break
        case 'm':
        case 'M':
          toggleMarkForReview()
          break
        case 'Delete':
        case 'Backspace':
          clearResponse()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    goNext,
    goPrevious,
    selectAnswer,
    clearResponse,
    toggleMarkForReview,
    currentQuestionIndex,
    totalQuestions,
    openSubmitModal,
    examCompleted,
  ])
}
