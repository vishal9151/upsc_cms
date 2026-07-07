export const STORAGE_VERSION = 1

export const EXAM_STORAGE_PREFIX = 'exam-'

export interface PersistedExamState {
  version: number
  year: string
  paper: string
  currentQuestionIndex: number
  remainingTime: number
  answers: Record<number, number>
  visitedQuestions: number[]
  markedForReview: number[]
  answeredAndReview: number[]
  totalQuestions: number
  examStarted: boolean
  examCompleted: boolean
  submitted: boolean
  lastUpdated: string
}

export interface SavedExamSummary {
  year: string
  paper: string
  state: PersistedExamState
}
