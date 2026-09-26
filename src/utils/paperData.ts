import type { PaperId, Question } from '@/types/exam'
import type { ExamKey, ExamMetaConfig, ExamPaperMeta } from '@/types/exams'
import { DEFAULT_EXAM_KEY, resolveExamKey } from '@/types/exams'
import type { SubjectKey } from '@/types/subject'
import examsIndex from '@/data/exams.json'

import data2021Paper1 from '@/data/2021-paper1.json'
import data2021Paper2 from '@/data/2021-paper2.json'
import data2022Paper1 from '@/data/2022-paper1.json'
import data2022Paper2 from '@/data/2022-paper2.json'
import data2023Paper1 from '@/data/2023-paper1.json'
import data2023Paper2 from '@/data/2023-paper2.json'
import data2024Paper1 from '@/data/2024-paper1.json'
import data2024Paper2 from '@/data/2024-paper2.json'
import data2025Paper1 from '@/data/2025-paper1.json'
import data2025Paper2 from '@/data/2025-paper2.json'
import dataRajasthanMo2022 from '@/data/rajasthan-mo/2022.json'
import dataRajasthanMo2024 from '@/data/rajasthan-mo/2024.json'

function normalizeQuestions(raw: unknown): Question[] {
  if (!Array.isArray(raw)) return []

  return raw.map((item) => {
    const question = item as Record<string, unknown>
    const options = question.options

    return {
      id: question.id as number,
      question: question.question as string,
      options: options as Question['options'],
      correctAnswer: question.correctAnswer as number,
      explanation: question.explanation as string,
      subject_keys: (question.subject_keys as SubjectKey[] | undefined) ?? [],
      sub_topics: (question.sub_topics as string[] | undefined) ?? [],
    }
  })
}

/** Static import map: relative file path from exams.json → question array */
const fileDataMap: Record<string, Question[]> = {
  '2021-paper1.json': normalizeQuestions(data2021Paper1),
  '2021-paper2.json': normalizeQuestions(data2021Paper2),
  '2022-paper1.json': normalizeQuestions(data2022Paper1),
  '2022-paper2.json': normalizeQuestions(data2022Paper2),
  '2023-paper1.json': normalizeQuestions(data2023Paper1),
  '2023-paper2.json': normalizeQuestions(data2023Paper2),
  '2024-paper1.json': normalizeQuestions(data2024Paper1),
  '2024-paper2.json': normalizeQuestions(data2024Paper2),
  '2025-paper1.json': normalizeQuestions(data2025Paper1),
  '2025-paper2.json': normalizeQuestions(data2025Paper2),
  'rajasthan-mo/2022.json': normalizeQuestions(dataRajasthanMo2022),
  'rajasthan-mo/2024.json': normalizeQuestions(dataRajasthanMo2024),
}

function paperLookupKey(examKey: ExamKey, year: string, paper: string): string {
  return `${examKey}:${year}-${paper}`
}

const paperDataMap: Record<string, Question[]> = {}

for (const exam of examsIndex.exams) {
  const examKey = resolveExamKey(exam.key)
  for (const paper of exam.papers) {
    const questions = fileDataMap[paper.file] ?? []
    paperDataMap[paperLookupKey(examKey, paper.year, paper.paper)] = questions
  }
}

export function getExams(): ExamMetaConfig[] {
  return examsIndex.exams.map((exam) => ({
    ...exam,
    key: resolveExamKey(exam.key),
  }))
}

export function getExamConfig(examKey?: string | null): ExamMetaConfig | undefined {
  const key = resolveExamKey(examKey)
  return getExams().find((exam) => exam.key === key)
}

export function getExamPapers(
  examKey?: string | null,
  options?: { visibleOnly?: boolean },
): ExamPaperMeta[] {
  const exam = getExamConfig(examKey)
  if (!exam) return []
  if (options?.visibleOnly) {
    return exam.papers.filter((paper) => paper.visible)
  }
  return exam.papers
}

export function getPaperMeta(
  year: string,
  paper: string,
  examKey?: string | null,
): ExamPaperMeta | undefined {
  return getExamPapers(examKey).find(
    (entry) => entry.year === year && entry.paper === paper,
  )
}

/**
 * Load questions for a paper. `examKey` defaults to `"cms"` so existing
 * CMS call sites keep working without changes.
 */
export function getPaperQuestions(
  year: string,
  paper: string,
  examKey?: string | null,
): Question[] {
  const key = resolveExamKey(examKey)
  return paperDataMap[paperLookupKey(key, year, paper)] ?? []
}

export function getPaperQuestionCount(
  year: string,
  paper: string,
  examKey?: string | null,
): number {
  return getPaperQuestions(year, paper, examKey).length
}

/** Subject keys that appear in a given paper (dynamic — not hardcoded). */
export function getPaperSubjectKeys(
  year: string,
  paper: string,
  examKey?: string | null,
): SubjectKey[] {
  const seen = new Set<SubjectKey>()
  for (const question of getPaperQuestions(year, paper, examKey)) {
    for (const subject of question.subject_keys ?? []) {
      seen.add(subject)
    }
  }
  return Array.from(seen)
}

export function getPaperLabel(
  paper: string,
  examKey?: string | null,
  year?: string,
): string {
  if (year) {
    const meta = getPaperMeta(year, paper, examKey)
    if (meta) return meta.label
  }
  if (paper === 'paper1') return 'Paper I (Morning)'
  if (paper === 'paper2') return 'Paper II (Evening)'
  if (paper === 'full') return 'Full Paper'
  return paper
}

export function isValidPaper(paper: string): paper is PaperId {
  return paper === 'paper1' || paper === 'paper2'
}

export function isValidExamPaper(
  year: string,
  paper: string,
  examKey?: string | null,
): boolean {
  return getPaperQuestions(year, paper, examKey).length > 0
}

/** CMS years only — used by practice builders (CMS question pool). */
export const EXAM_YEARS = ['2025', '2024', '2023', '2022', '2021'] as const

export const EXAM_DURATION_MINUTES = 120

export { DEFAULT_EXAM_KEY }
