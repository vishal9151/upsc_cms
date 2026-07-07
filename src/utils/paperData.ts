import type { PaperId, Question } from '@/types/exam'

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

const paperDataMap: Record<string, Question[]> = {
  '2021-paper1': data2021Paper1 as Question[],
  '2021-paper2': data2021Paper2 as Question[],
  '2022-paper1': data2022Paper1 as Question[],
  '2022-paper2': data2022Paper2 as Question[],
  '2023-paper1': data2023Paper1 as Question[],
  '2023-paper2': data2023Paper2 as Question[],
  '2024-paper1': data2024Paper1 as Question[],
  '2024-paper2': data2024Paper2 as Question[],
  '2025-paper1': data2025Paper1 as Question[],
  '2025-paper2': data2025Paper2 as Question[],
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
