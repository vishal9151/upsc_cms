export const EXAM_KEYS = ['cms', 'rajasthan-mo'] as const

export type ExamKey = (typeof EXAM_KEYS)[number]

export const DEFAULT_EXAM_KEY: ExamKey = 'cms'

export interface ExamPaperMeta {
  key: string
  year: string
  paper: string
  label: string
  file: string
  visible: boolean
}

export interface ExamMetaConfig {
  key: ExamKey
  label: string
  shortLabel: string
  description: string
  papers: ExamPaperMeta[]
}

export interface ExamsIndex {
  exams: ExamMetaConfig[]
}

export function isExamKey(value: string | undefined | null): value is ExamKey {
  return EXAM_KEYS.includes(value as ExamKey)
}

export function resolveExamKey(
  value: string | undefined | null,
): ExamKey {
  return isExamKey(value) ? value : DEFAULT_EXAM_KEY
}
