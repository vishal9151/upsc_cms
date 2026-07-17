import type { PracticeFilters, PracticeIndexEntry, PracticeTestConfig } from '@/types/practice'
import { CUSTOM_EXAM_YEAR } from '@/types/practice'
import { deleteExam, hasSavedExam, loadExam } from '@/utils/examStorage'
import type { PersistedExamState } from '@/types/persistence'
import {
  getPracticeIndex,
  loadPracticeConfig,
} from '@/utils/practiceStorage'

export type PracticeCardKind = 'custom' | 'topic' | 'high_yield'

export function resolvePracticeKind(
  filters: PracticeFilters,
): PracticeCardKind {
  if (filters.practiceKind === 'high_yield') return 'high_yield'
  if (filters.practiceKind === 'topic') return 'topic'
  if (filters.subTopics !== undefined) return 'topic'
  return 'custom'
}

function matchesPracticeKind(
  filters: PracticeFilters,
  kind: PracticeCardKind,
): boolean {
  return resolvePracticeKind(filters) === kind
}

export function filterPracticeIndexByKind(
  kind: PracticeCardKind,
  limit?: number,
): PracticeIndexEntry[] {
  const entries = getPracticeIndex().filter((entry) =>
    matchesPracticeKind(entry.filters, kind),
  )
  return limit !== undefined ? entries.slice(0, limit) : entries
}

export function getInProgressPractice(kind: PracticeCardKind): {
  entry: PracticeIndexEntry
  saved: PersistedExamState
  config: PracticeTestConfig
} | null {
  for (const entry of getPracticeIndex()) {
    if (!matchesPracticeKind(entry.filters, kind)) continue
    if (!hasSavedExam(CUSTOM_EXAM_YEAR, entry.testId)) continue

    const saved = loadExam(CUSTOM_EXAM_YEAR, entry.testId)
    const config = loadPracticeConfig(entry.testId)
    if (saved && config) {
      return { entry, saved, config }
    }
  }
  return null
}

export function deleteInProgressPractice(testId: string): void {
  deleteExam(CUSTOM_EXAM_YEAR, testId)
}
