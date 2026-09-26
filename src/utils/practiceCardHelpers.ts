import type { PracticeFilters, PracticeIndexEntry, PracticeTestConfig } from '@/types/practice'
import { CUSTOM_EXAM_YEAR, resolvePracticeExamKey } from '@/types/practice'
import type { ExamKey } from '@/types/exams'
import { DEFAULT_EXAM_KEY } from '@/types/exams'
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

function matchesExamKey(
  filters: PracticeFilters,
  examKey: ExamKey,
): boolean {
  return resolvePracticeExamKey(filters) === examKey
}

export function filterPracticeIndexByKind(
  kind: PracticeCardKind,
  limit?: number,
  examKey: ExamKey = DEFAULT_EXAM_KEY,
): PracticeIndexEntry[] {
  const entries = getPracticeIndex().filter(
    (entry) =>
      matchesPracticeKind(entry.filters, kind) &&
      matchesExamKey(entry.filters, examKey),
  )
  return limit !== undefined ? entries.slice(0, limit) : entries
}

export function getInProgressPractice(
  kind: PracticeCardKind,
  examKey: ExamKey = DEFAULT_EXAM_KEY,
): {
  entry: PracticeIndexEntry
  saved: PersistedExamState
  config: PracticeTestConfig
} | null {
  for (const entry of getPracticeIndex()) {
    if (!matchesPracticeKind(entry.filters, kind)) continue
    if (!matchesExamKey(entry.filters, examKey)) continue
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
