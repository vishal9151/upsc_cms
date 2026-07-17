import type { PaperId, Question } from '@/types/exam'
import type { SubjectKey } from '@/types/subject'

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

const paperDataMap: Record<string, Question[]> = {
  '2021-paper1': normalizeQuestions(data2021Paper1),
  '2021-paper2': normalizeQuestions(data2021Paper2),
  '2022-paper1': normalizeQuestions(data2022Paper1),
  '2022-paper2': normalizeQuestions(data2022Paper2),
  '2023-paper1': normalizeQuestions(data2023Paper1),
  '2023-paper2': normalizeQuestions(data2023Paper2),
  '2024-paper1': normalizeQuestions(data2024Paper1),
  '2024-paper2': normalizeQuestions(data2024Paper2),
  '2025-paper1': normalizeQuestions(data2025Paper1),
  '2025-paper2': normalizeQuestions(data2025Paper2),
}

export function getPaperQuestions(year: string, paper: string): Question[] {
  return paperDataMap[`${year}-${paper}`] ?? []
}

export function getPaperQuestionCount(year: string, paper: string): number {
  return getPaperQuestions(year, paper).length
}

export function getPaperLabel(paper: string): string {
  if (paper === 'paper1') return 'Paper I (Morning)'
  if (paper === 'paper2') return 'Paper II (Evening)'
  return paper
}

export function isValidPaper(paper: string): paper is PaperId {
  return paper === 'paper1' || paper === 'paper2'
}

export const EXAM_YEARS = ['2025', '2024', '2023', '2022', '2021'] as const

export const EXAM_DURATION_MINUTES = 120
