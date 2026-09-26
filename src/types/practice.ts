import type { Question } from '@/types/exam'
import type { SubjectKey } from '@/types/subject'
import type { ExamKey } from '@/types/exams'
import { DEFAULT_EXAM_KEY } from '@/types/exams'

export const PRACTICE_CONFIG_VERSION = 1
export const CUSTOM_EXAM_YEAR = 'custom'
export const PRACTICE_CONFIG_PREFIX = 'practice-config-'
export const PRACTICE_INDEX_KEY = 'practice-index'
export const MAX_PRACTICE_INDEX_ENTRIES = 20

export interface PracticeFilters {
  subjects: SubjectKey[]
  /** When set, only tagged questions matching these subtopics are included. */
  subTopics?: string[]
  /** Distinguishes topic-level vs high-yield practice in saved configs. */
  practiceKind?: 'topic' | 'high_yield'
  years: string[]
  questionCount: number
  randomize?: boolean
  /** Which exam's papers to pull from. Defaults to cms for older saved configs. */
  examKey?: ExamKey
}

export interface PracticeTestConfig {
  version: number
  testId: string
  label: string
  filters: PracticeFilters
  questions: Question[]
  createdAt: string
  examMode: 'practice'
  isTimed: false
}

export interface PracticeIndexEntry {
  testId: string
  label: string
  createdAt: string
  questionCount: number
  filters: PracticeFilters
}

export type PoolEntry = Question & {
  sourceYear: string
  sourcePaper: string
  sourceId: number
  dedupKey: string
  sourceExamKey: ExamKey
}

export function resolvePracticeExamKey(
  filters: Pick<PracticeFilters, 'examKey'> | undefined | null,
): ExamKey {
  return filters?.examKey ?? DEFAULT_EXAM_KEY
}
