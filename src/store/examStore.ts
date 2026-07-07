import { create } from 'zustand'
import type { PersistedExamState } from '@/types/persistence'
import type { ExamMeta, Question } from '@/types/exam'
import {
  EXAM_DURATION_SECONDS,
  getAnsweredAndReviewIndices,
  preparePaperQuestions,
} from '@/utils/examHelpers'

interface ExamStoreState {
  year: string
  paper: string
  questions: Question[]

  currentQuestionIndex: number
  answers: Record<number, number>
  visitedQuestions: number[]
  markedForReview: number[]

  examStarted: boolean
  remainingTime: number
  totalQuestions: number
  examCompleted: boolean
  submitted: boolean

  isHydrated: boolean

  showSubmitModal: boolean
  showTimeUpModal: boolean
  pendingAutoSubmit: boolean
}

interface ExamStoreActions {
  initExam: (meta: ExamMeta, rawQuestions: Question[]) => void
  restoreExam: (
    meta: ExamMeta,
    rawQuestions: Question[],
    saved: PersistedExamState,
  ) => void
  goToQuestion: (index: number) => void
  goNext: () => void
  goPrevious: () => void
  selectAnswer: (optionIndex: number) => void
  clearResponse: () => void
  toggleMarkForReview: () => void
  tickTimer: () => void
  openSubmitModal: () => void
  closeSubmitModal: () => void
  openTimeUpModal: () => void
  closeTimeUpModal: () => void
  setPendingAutoSubmit: (value: boolean) => void
  setExamCompleted: () => void
  setSubmitted: () => void
  setHydrated: (value: boolean) => void
  reset: () => void
}

type ExamStore = ExamStoreState & ExamStoreActions

const initialState: ExamStoreState = {
  year: '',
  paper: '',
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  visitedQuestions: [],
  markedForReview: [],
  examStarted: false,
  remainingTime: EXAM_DURATION_SECONDS,
  totalQuestions: 0,
  examCompleted: false,
  submitted: false,
  isHydrated: false,
  showSubmitModal: false,
  showTimeUpModal: false,
  pendingAutoSubmit: false,
}

function markVisited(
  visitedQuestions: number[],
  index: number,
): number[] {
  if (visitedQuestions.includes(index)) return visitedQuestions
  return [...visitedQuestions, index]
}

function isReadOnly(get: () => ExamStore): boolean {
  const { submitted, examCompleted } = get()
  return submitted || examCompleted
}

export const useExamStore = create<ExamStore>((set, get) => ({
  ...initialState,

  initExam: (meta, rawQuestions) => {
    const questions = preparePaperQuestions(rawQuestions)
    set({
      ...initialState,
      year: meta.year,
      paper: meta.paper,
      questions,
      totalQuestions: questions.length,
      examStarted: true,
      visitedQuestions: [0],
      remainingTime: EXAM_DURATION_SECONDS,
      isHydrated: true,
    })
  },

  restoreExam: (meta, rawQuestions, saved) => {
    const questions = preparePaperQuestions(rawQuestions)
    const timeExpired =
      saved.examCompleted && saved.remainingTime === 0 && !saved.submitted
    set({
      ...initialState,
      year: meta.year,
      paper: meta.paper,
      questions,
      currentQuestionIndex: saved.currentQuestionIndex,
      answers: saved.answers,
      visitedQuestions: saved.visitedQuestions,
      markedForReview: saved.markedForReview,
      remainingTime: saved.remainingTime,
      totalQuestions: questions.length,
      examStarted: saved.examStarted,
      examCompleted: saved.examCompleted,
      submitted: saved.submitted,
      showTimeUpModal: timeExpired,
      pendingAutoSubmit: timeExpired,
      isHydrated: true,
    })
  },

  goToQuestion: (index) => {
    if (isReadOnly(get)) return
    const { totalQuestions } = get()
    if (index < 0 || index >= totalQuestions) return

    set((state) => ({
      currentQuestionIndex: index,
      visitedQuestions: markVisited(state.visitedQuestions, index),
    }))
  },

  goNext: () => {
    if (isReadOnly(get)) return
    const { currentQuestionIndex, totalQuestions } = get()
    if (currentQuestionIndex >= totalQuestions - 1) return
    get().goToQuestion(currentQuestionIndex + 1)
  },

  goPrevious: () => {
    if (isReadOnly(get)) return
    const { currentQuestionIndex } = get()
    if (currentQuestionIndex <= 0) return
    get().goToQuestion(currentQuestionIndex - 1)
  },

  selectAnswer: (optionIndex) => {
    if (isReadOnly(get)) return
    set((state) => ({
      answers: {
        ...state.answers,
        [state.currentQuestionIndex]: optionIndex,
      },
    }))
  },

  clearResponse: () => {
    if (isReadOnly(get)) return
    set((state) => {
      const { [state.currentQuestionIndex]: _, ...rest } = state.answers
      return { answers: rest }
    })
  },

  toggleMarkForReview: () => {
    if (isReadOnly(get)) return
    set((state) => {
      const index = state.currentQuestionIndex
      const isMarked = state.markedForReview.includes(index)
      return {
        markedForReview: isMarked
          ? state.markedForReview.filter((i) => i !== index)
          : [...state.markedForReview, index],
      }
    })
  },

  tickTimer: () => {
    const { remainingTime, examCompleted, submitted } = get()
    if (examCompleted || submitted) return

    if (remainingTime <= 1) {
      set({
        remainingTime: 0,
        examCompleted: true,
        showTimeUpModal: true,
        pendingAutoSubmit: true,
      })
      return
    }

    set({ remainingTime: remainingTime - 1 })
  },

  openSubmitModal: () => {
    if (isReadOnly(get)) return
    set({ showSubmitModal: true })
  },
  closeSubmitModal: () => set({ showSubmitModal: false }),
  openTimeUpModal: () => set({ showTimeUpModal: true }),
  closeTimeUpModal: () => set({ showTimeUpModal: false }),
  setPendingAutoSubmit: (value) => set({ pendingAutoSubmit: value }),

  setExamCompleted: () => set({ examCompleted: true }),
  setSubmitted: () => set({ submitted: true, examCompleted: true }),
  setHydrated: (value) => set({ isHydrated: value }),

  reset: () => set(initialState),
}))

export function useExamStats() {
  const visitedQuestions = useExamStore((s) => s.visitedQuestions)
  const answers = useExamStore((s) => s.answers)
  const markedForReview = useExamStore((s) => s.markedForReview)
  const totalQuestions = useExamStore((s) => s.totalQuestions)

  const answeredCount = Object.keys(answers).length
  const visitedCount = visitedQuestions.length
  const reviewCount = markedForReview.length
  const answeredAndReview = getAnsweredAndReviewIndices(answers, markedForReview)
  const remainingCount = totalQuestions - visitedCount
  const unansweredCount = totalQuestions - answeredCount

  const progressPercent =
    totalQuestions > 0
      ? Math.round((answeredCount / totalQuestions) * 100)
      : 0

  return {
    answeredCount,
    visitedCount,
    reviewCount,
    answeredAndReviewCount: answeredAndReview.length,
    remainingCount,
    unansweredCount,
    progressPercent,
  }
}

export function useCurrentAnswer() {
  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex)
  const answers = useExamStore((s) => s.answers)
  return answers[currentQuestionIndex]
}

export function useIsMarkedForReview() {
  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex)
  const markedForReview = useExamStore((s) => s.markedForReview)
  return markedForReview.includes(currentQuestionIndex)
}

export function useIsExamReadOnly() {
  const submitted = useExamStore((s) => s.submitted)
  const examCompleted = useExamStore((s) => s.examCompleted)
  return submitted || examCompleted
}
