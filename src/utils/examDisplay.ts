import { isCustomExamYear, loadPracticeConfig } from '@/utils/practiceStorage'
import { resolvePracticeLabel } from '@/utils/questionResolver'
import { getExamConfig, getPaperLabel } from '@/utils/paperData'
import { DEFAULT_EXAM_KEY, type ExamKey } from '@/types/exams'

export function getExamSubtitle(
  year: string,
  paper: string,
  examKey: ExamKey = DEFAULT_EXAM_KEY,
): string {
  if (isCustomExamYear(year)) {
    return resolvePracticeLabel(year, paper) ?? 'Custom Practice Test'
  }
  if (examKey !== DEFAULT_EXAM_KEY) {
    return getPaperLabel(paper, examKey, year)
  }
  return `${year} · ${getPaperLabel(paper)}`
}

export function getExamTitle(
  year: string,
  paper?: string,
  examKey: ExamKey = DEFAULT_EXAM_KEY,
): string {
  if (isCustomExamYear(year)) {
    if (paper) {
      const kind = loadPracticeConfig(paper)?.filters.practiceKind
      if (kind === 'high_yield') return 'High Yield Practice'
      if (kind === 'topic') return 'Subject-level Practice'
    }
    return 'Custom Practice Test'
  }
  return getExamConfig(examKey)?.label ?? 'UPSC CMS Examination'
}
