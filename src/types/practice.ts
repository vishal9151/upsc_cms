import type { Question } from '@/types/exam'
import type { SubjectKey } from '@/types/subject'

export const PRACTICE_CONFIG_VERSION = 1
export const CUSTOM_EXAM_YEAR = 'custom'
export const PRACTICE_CONFIG_PREFIX = 'practice-config-'
export const PRACTICE_INDEX_KEY = 'practice-index'
export const MAX_PRACTICE_INDEX_ENTRIES = 20

export interface PracticeFilters {
  subjects: SubjectKey[]
  /** When set, only tagged questions matching these subtopics are included. */
  subTopics?: string[]
  years: string[]
  questionCount: number
  randomize?: boolean
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
}
