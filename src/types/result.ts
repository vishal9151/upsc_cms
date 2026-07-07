export type QuestionResultStatus = 'correct' | 'incorrect' | 'skipped'

export type ReviewFilter =
  | 'all'
  | 'correct'
  | 'incorrect'
  | 'skipped'
  | 'marked'
  | 'answered'

export interface QuestionResult {
  index: number
  questionId: number
  status: QuestionResultStatus
  userAnswer: number | null
  correctAnswer: number
  isMarked: boolean
}

export interface ExamResultSummary {
  attemptId: string
  totalQuestions: number
  attempted: number
  correct: number
  incorrect: number
  skipped: number
  accuracy: number
  score: number
  maxScore: number
  scorePercent: number
  timeTakenSeconds: number
  submittedAt: string
  autoSubmitted: boolean
}

export interface StoredExamResult {
  version: number
  year: string
  paper: string
  summary: ExamResultSummary
  answers: Record<number, number>
  markedForReview: number[]
  questionResults: QuestionResult[]
}

export interface PaperHistory {
  version: number
  year: string
  paper: string
  bestScore: number
  bestScorePercent: number
  latestScore: number
  latestScorePercent: number
  attemptCount: number
  lastAttemptDate: string
  attempts: ExamResultSummary[]
}
