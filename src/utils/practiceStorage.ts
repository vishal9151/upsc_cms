import type {
  PracticeIndexEntry,
  PracticeTestConfig,
} from '@/types/practice'
import {
  CUSTOM_EXAM_YEAR,
  MAX_PRACTICE_INDEX_ENTRIES,
  PRACTICE_CONFIG_PREFIX,
  PRACTICE_CONFIG_VERSION,
  PRACTICE_INDEX_KEY,
} from '@/types/practice'

export function getPracticeConfigKey(testId: string): string {
  return `${PRACTICE_CONFIG_PREFIX}${testId}`
}

export function isCustomExamYear(year: string): boolean {
  return year === CUSTOM_EXAM_YEAR
}

function validatePracticeConfig(data: unknown): PracticeTestConfig | null {
  if (typeof data !== 'object' || data === null) return null
  const obj = data as Record<string, unknown>
  if (obj.version !== PRACTICE_CONFIG_VERSION) return null
  if (typeof obj.testId !== 'string') return null
  if (typeof obj.label !== 'string') return null
  if (!Array.isArray(obj.questions) || obj.questions.length === 0) return null
  if (typeof obj.createdAt !== 'string') return null
  return obj as unknown as PracticeTestConfig
}

export function savePracticeConfig(config: PracticeTestConfig): void {
  try {
    localStorage.setItem(
      getPracticeConfigKey(config.testId),
      JSON.stringify({ ...config, version: PRACTICE_CONFIG_VERSION }),
    )
    upsertPracticeIndexEntry({
      testId: config.testId,
      label: config.label,
      createdAt: config.createdAt,
      questionCount: config.questions.length,
      filters: config.filters,
    })
  } catch {
    // Fail silently
  }
}

export function loadPracticeConfig(testId: string): PracticeTestConfig | null {
  try {
    const raw = localStorage.getItem(getPracticeConfigKey(testId))
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    const validated = validatePracticeConfig(parsed)
    if (!validated || validated.testId !== testId) {
      deletePracticeConfig(testId)
      return null
    }
    return validated
  } catch {
    deletePracticeConfig(testId)
    return null
  }
}

export function deletePracticeConfig(testId: string): void {
  try {
    localStorage.removeItem(getPracticeConfigKey(testId))
    removePracticeIndexEntry(testId)
  } catch {
    // Fail silently
  }
}

function loadPracticeIndex(): PracticeIndexEntry[] {
  try {
    const raw = localStorage.getItem(PRACTICE_INDEX_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as PracticeIndexEntry[]
  } catch {
    return []
  }
}

function savePracticeIndex(entries: PracticeIndexEntry[]): void {
  try {
    localStorage.setItem(PRACTICE_INDEX_KEY, JSON.stringify(entries))
  } catch {
    // Fail silently
  }
}

function upsertPracticeIndexEntry(entry: PracticeIndexEntry): void {
  const existing = loadPracticeIndex().filter((e) => e.testId !== entry.testId)
  const updated = [entry, ...existing].slice(0, MAX_PRACTICE_INDEX_ENTRIES)
  savePracticeIndex(updated)
}

function removePracticeIndexEntry(testId: string): void {
  savePracticeIndex(loadPracticeIndex().filter((e) => e.testId !== testId))
}

export function getPracticeIndex(): PracticeIndexEntry[] {
  return loadPracticeIndex()
}

export function getRecentPracticeEntries(limit = 5): PracticeIndexEntry[] {
  return loadPracticeIndex().slice(0, limit)
}
