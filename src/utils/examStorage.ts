import type { PersistedExamState, SavedExamSummary } from '@/types/persistence'
import { EXAM_STORAGE_PREFIX, STORAGE_VERSION } from '@/types/persistence'
import { getAnsweredAndReviewIndices } from '@/utils/examHelpers'

export function getExamStorageKey(year: string, paper: string): string {
  return `${EXAM_STORAGE_PREFIX}${year}-${paper}`
}

function parseStorageKey(key: string): { year: string; paper: string } | null {
  if (!key.startsWith(EXAM_STORAGE_PREFIX)) return null
  const rest = key.slice(EXAM_STORAGE_PREFIX.length)
  const lastDash = rest.lastIndexOf('-')
  if (lastDash === -1) return null
  return {
    year: rest.slice(0, lastDash),
    paper: rest.slice(lastDash + 1),
  }
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'number')
}

function parseAnswers(raw: unknown): Record<number, number> | null {
  if (typeof raw !== 'object' || raw === null) return null
  const answers: Record<number, number> = {}
  for (const [key, value] of Object.entries(raw)) {
    const index = Number(key)
    if (!Number.isInteger(index) || typeof value !== 'number') return null
    answers[index] = value
  }
  return answers
}

function validatePersistedState(data: unknown): PersistedExamState | null {
  if (typeof data !== 'object' || data === null) return null

  const obj = data as Record<string, unknown>

  if (obj.version !== STORAGE_VERSION) return null
  if (typeof obj.year !== 'string' || typeof obj.paper !== 'string') return null
  if (typeof obj.currentQuestionIndex !== 'number') return null
  if (typeof obj.remainingTime !== 'number') return null
  if (typeof obj.totalQuestions !== 'number') return null
  if (typeof obj.examStarted !== 'boolean') return null
  if (typeof obj.examCompleted !== 'boolean') return null
  if (typeof obj.submitted !== 'boolean') return null
  if (typeof obj.lastUpdated !== 'string') return null
  if (!isNumberArray(obj.visitedQuestions)) return null
  if (!isNumberArray(obj.markedForReview)) return null
  if (!isNumberArray(obj.answeredAndReview)) return null

  const answers = parseAnswers(obj.answers)
  if (!answers) return null

  if (obj.currentQuestionIndex < 0 || obj.remainingTime < 0) return null
  if (obj.totalQuestions <= 0) return null

  return {
    version: STORAGE_VERSION,
    year: obj.year,
    paper: obj.paper,
    currentQuestionIndex: obj.currentQuestionIndex,
    remainingTime: obj.remainingTime,
    answers,
    visitedQuestions: obj.visitedQuestions,
    markedForReview: obj.markedForReview,
    answeredAndReview: obj.answeredAndReview,
    totalQuestions: obj.totalQuestions,
    examStarted: obj.examStarted,
    examCompleted: obj.examCompleted,
    submitted: obj.submitted,
    lastUpdated: obj.lastUpdated,
  }
}

export function isUnfinishedExam(state: PersistedExamState): boolean {
  return state.examStarted && !state.examCompleted && !state.submitted
}

export function saveExam(state: PersistedExamState): void {
  try {
    const key = getExamStorageKey(state.year, state.paper)
    const payload: PersistedExamState = {
      ...state,
      version: STORAGE_VERSION,
      answeredAndReview: getAnsweredAndReviewIndices(
        state.answers,
        state.markedForReview,
      ),
      lastUpdated: new Date().toISOString(),
    }
    localStorage.setItem(key, JSON.stringify(payload))
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function loadExam(year: string, paper: string): PersistedExamState | null {
  try {
    const key = getExamStorageKey(year, paper)
    const raw = localStorage.getItem(key)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    const validated = validatePersistedState(parsed)

    if (!validated) {
      deleteExam(year, paper)
      return null
    }

    if (validated.year !== year || validated.paper !== paper) {
      deleteExam(year, paper)
      return null
    }

    return validated
  } catch {
    deleteExam(year, paper)
    return null
  }
}

export function deleteExam(year: string, paper: string): void {
  try {
    localStorage.removeItem(getExamStorageKey(year, paper))
  } catch {
    // Fail silently
  }
}

export function hasSavedExam(year: string, paper: string): boolean {
  const state = loadExam(year, paper)
  return state !== null && isUnfinishedExam(state)
}

export function getAllSavedExams(): SavedExamSummary[] {
  const results: SavedExamSummary[] = []

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith(EXAM_STORAGE_PREFIX)) continue

      const parsed = parseStorageKey(key)
      if (!parsed) continue

      const state = loadExam(parsed.year, parsed.paper)
      if (state && isUnfinishedExam(state)) {
        results.push({ year: parsed.year, paper: parsed.paper, state })
      }
    }
  } catch {
    return []
  }

  return results
}

export function buildPersistedStateFromStore(state: {
  year: string
  paper: string
  currentQuestionIndex: number
  answers: Record<number, number>
  visitedQuestions: number[]
  markedForReview: number[]
  remainingTime: number
  totalQuestions: number
  examStarted: boolean
  examCompleted: boolean
  submitted: boolean
}): PersistedExamState {
  return {
    version: STORAGE_VERSION,
    year: state.year,
    paper: state.paper,
    currentQuestionIndex: state.currentQuestionIndex,
    remainingTime: state.remainingTime,
    answers: state.answers,
    visitedQuestions: state.visitedQuestions,
    markedForReview: state.markedForReview,
    answeredAndReview: getAnsweredAndReviewIndices(
      state.answers,
      state.markedForReview,
    ),
    totalQuestions: state.totalQuestions,
    examStarted: state.examStarted,
    examCompleted: state.examCompleted,
    submitted: state.submitted,
    lastUpdated: new Date().toISOString(),
  }
}
