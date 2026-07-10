import type { Question } from '@/types/exam'
import { isCustomExamYear, loadPracticeConfig } from '@/utils/practiceStorage'
import { getPaperQuestions } from '@/utils/paperData'

export function resolveExamQuestions(year: string, paper: string): Question[] {
  if (isCustomExamYear(year)) {
    return loadPracticeConfig(paper)?.questions ?? []
  }
  return getPaperQuestions(year, paper)
}

export function resolvePracticeLabel(
  year: string,
  paper: string,
): string | null {
  if (!isCustomExamYear(year)) return null
  return loadPracticeConfig(paper)?.label ?? null
}
