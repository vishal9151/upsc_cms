import { isCustomExamYear } from '@/utils/practiceStorage'
import { resolvePracticeLabel } from '@/utils/questionResolver'
import { getPaperLabel } from '@/utils/paperData'

export function getExamSubtitle(year: string, paper: string): string {
  if (isCustomExamYear(year)) {
    return resolvePracticeLabel(year, paper) ?? 'Custom Practice Test'
  }
  return `${year} · ${getPaperLabel(paper)}`
}

export function getExamTitle(year: string): string {
  if (isCustomExamYear(year)) return 'Custom Practice Test'
  return 'UPSC CMS Examination'
}
