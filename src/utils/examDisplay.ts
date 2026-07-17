import { isCustomExamYear, loadPracticeConfig } from '@/utils/practiceStorage'
import { resolvePracticeLabel } from '@/utils/questionResolver'
import { getPaperLabel } from '@/utils/paperData'

export function getExamSubtitle(year: string, paper: string): string {
  if (isCustomExamYear(year)) {
    return resolvePracticeLabel(year, paper) ?? 'Custom Practice Test'
  }
  return `${year} · ${getPaperLabel(paper)}`
}

export function getExamTitle(year: string, paper?: string): string {
  if (isCustomExamYear(year)) {
    if (paper) {
      const kind = loadPracticeConfig(paper)?.filters.practiceKind
      if (kind === 'high_yield') return 'High Yield Practice'
      if (kind === 'topic') return 'Subject-level Practice'
    }
    return 'Custom Practice Test'
  }
  return 'UPSC CMS Examination'
}
