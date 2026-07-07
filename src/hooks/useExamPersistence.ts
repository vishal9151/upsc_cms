import { useEffect, useRef } from 'react'
import { useExamStore } from '@/store/examStore'
import { buildPersistedStateFromStore, saveExam } from '@/utils/examStorage'

const TIMER_SAVE_INTERVAL_MS = 5000

function shouldPersistExam(): boolean {
  const state = useExamStore.getState()
  return (
    state.isHydrated &&
    state.examStarted &&
    Boolean(state.year && state.paper) &&
    !state.submitted
  )
}

export function useExamPersistence() {
  const isHydrated = useExamStore((s) => s.isHydrated)
  const examStarted = useExamStore((s) => s.examStarted)
  const year = useExamStore((s) => s.year)
  const paper = useExamStore((s) => s.paper)

  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex)
  const answers = useExamStore((s) => s.answers)
  const visitedQuestions = useExamStore((s) => s.visitedQuestions)
  const markedForReview = useExamStore((s) => s.markedForReview)
  const examCompleted = useExamStore((s) => s.examCompleted)
  const submitted = useExamStore((s) => s.submitted)
  const totalQuestions = useExamStore((s) => s.totalQuestions)

  const remainingTime = useExamStore((s) => s.remainingTime)
  const lastTimerSaveRef = useRef(0)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!shouldPersistExam()) return

    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    saveExam(buildPersistedStateFromStore(useExamStore.getState()))
  }, [
    isHydrated,
    examStarted,
    year,
    paper,
    currentQuestionIndex,
    answers,
    visitedQuestions,
    markedForReview,
    examCompleted,
    submitted,
    totalQuestions,
  ])

  useEffect(() => {
    if (!shouldPersistExam()) return

    const now = Date.now()
    if (now - lastTimerSaveRef.current < TIMER_SAVE_INTERVAL_MS) return

    lastTimerSaveRef.current = now
    saveExam(buildPersistedStateFromStore(useExamStore.getState()))
  }, [isHydrated, examStarted, year, paper, remainingTime, submitted])

  useEffect(() => {
    return () => {
      if (!shouldPersistExam()) return
      saveExam(buildPersistedStateFromStore(useExamStore.getState()))
    }
  }, [])
}
