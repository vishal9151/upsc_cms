import type {
  ExamResultSummary,
  PaperHistory,
  StoredExamResult,
} from '@/types/result'
import { calculateExamResult, type CalculateResultInput } from '@/utils/scoreCalculator'

export const RESULT_STORAGE_VERSION = 1
export const HISTORY_STORAGE_VERSION = 1
export const RESULT_PREFIX = 'result-'
export const HISTORY_PREFIX = 'history-'

export function getResultStorageKey(year: string, paper: string): string {
  return `${RESULT_PREFIX}${year}-${paper}`
}

export function getHistoryStorageKey(year: string, paper: string): string {
  return `${HISTORY_PREFIX}${year}-${paper}`
}

function validateStoredResult(data: unknown): StoredExamResult | null {
  if (typeof data !== 'object' || data === null) return null
  const obj = data as Record<string, unknown>
  if (obj.version !== RESULT_STORAGE_VERSION) return null
  if (typeof obj.year !== 'string' || typeof obj.paper !== 'string') return null
  if (!obj.summary || !obj.questionResults || !Array.isArray(obj.questionResults))
    return null
  return obj as unknown as StoredExamResult
}

function validateHistory(data: unknown): PaperHistory | null {
  if (typeof data !== 'object' || data === null) return null
  const obj = data as Record<string, unknown>
  if (obj.version !== HISTORY_STORAGE_VERSION) return null
  if (typeof obj.year !== 'string' || typeof obj.paper !== 'string') return null
  if (typeof obj.attemptCount !== 'number') return null
  return obj as unknown as PaperHistory
}

export function saveExamResult(result: StoredExamResult): void {
  try {
    localStorage.setItem(
      getResultStorageKey(result.year, result.paper),
      JSON.stringify({ ...result, version: RESULT_STORAGE_VERSION }),
    )
  } catch {
    // Fail silently
  }
}

export function loadExamResult(
  year: string,
  paper: string,
): StoredExamResult | null {
  try {
    const raw = localStorage.getItem(getResultStorageKey(year, paper))
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    const validated = validateStoredResult(parsed)
    if (!validated || validated.year !== year || validated.paper !== paper) {
      deleteExamResult(year, paper)
      return null
    }
    return validated
  } catch {
    deleteExamResult(year, paper)
    return null
  }
}

export function deleteExamResult(year: string, paper: string): void {
  try {
    localStorage.removeItem(getResultStorageKey(year, paper))
  } catch {
    // Fail silently
  }
}

export function hasExamResult(year: string, paper: string): boolean {
  return loadExamResult(year, paper) !== null
}

export function loadPaperHistory(
  year: string,
  paper: string,
): PaperHistory | null {
  try {
    const raw = localStorage.getItem(getHistoryStorageKey(year, paper))
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    const validated = validateHistory(parsed)
    if (!validated || validated.year !== year || validated.paper !== paper) {
      deletePaperHistory(year, paper)
      return null
    }
    return validated
  } catch {
    deletePaperHistory(year, paper)
    return null
  }
}

export function deletePaperHistory(year: string, paper: string): void {
  try {
    localStorage.removeItem(getHistoryStorageKey(year, paper))
  } catch {
    // Fail silently
  }
}

function updateHistory(
  year: string,
  paper: string,
  summary: ExamResultSummary,
): PaperHistory {
  const existing = loadPaperHistory(year, paper)
  const attempts = existing
    ? [...existing.attempts, summary]
    : [summary]

  const bestAttempt = attempts.reduce((best, current) =>
    current.score > best.score ? current : best,
  )
  const latestAttempt = attempts[attempts.length - 1]

  const history: PaperHistory = {
    version: HISTORY_STORAGE_VERSION,
    year,
    paper,
    bestScore: bestAttempt.score,
    bestScorePercent: bestAttempt.scorePercent,
    latestScore: latestAttempt.score,
    latestScorePercent: latestAttempt.scorePercent,
    attemptCount: attempts.length,
    lastAttemptDate: latestAttempt.submittedAt,
    attempts,
  }

  try {
    localStorage.setItem(
      getHistoryStorageKey(year, paper),
      JSON.stringify(history),
    )
  } catch {
    // Fail silently
  }

  return history
}

export function processExamSubmission(
  input: CalculateResultInput,
): StoredExamResult {
  const { summary, questionResults } = calculateExamResult(input)

  const result: StoredExamResult = {
    version: RESULT_STORAGE_VERSION,
    year: input.year,
    paper: input.paper,
    summary,
    answers: input.answers,
    markedForReview: input.markedForReview,
    questionResults,
  }

  saveExamResult(result)
  updateHistory(input.year, input.paper, summary)

  return result
}
