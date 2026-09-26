import type { Question } from '@/types/exam'
import type { ExamKey } from '@/types/exams'
import { DEFAULT_EXAM_KEY } from '@/types/exams'
import { isCustomExamYear, loadPracticeConfig } from '@/utils/practiceStorage'
import { getPaperQuestions } from '@/utils/paperData'

export function resolveExamQuestions(
  year: string,
  paper: string,
  examKey: ExamKey = DEFAULT_EXAM_KEY,
): Question[] {
  if (isCustomExamYear(year)) {
    return loadPracticeConfig(paper)?.questions ?? []
  }
  return getPaperQuestions(year, paper, examKey)
}

export function resolvePracticeLabel(
  year: string,
  paper: string,
): string | null {
  if (!isCustomExamYear(year)) return null
  return loadPracticeConfig(paper)?.label ?? null
}
