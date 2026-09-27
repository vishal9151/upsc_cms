import { useLocation, useParams } from 'react-router-dom'
import type { ExamKey } from '@/types/exams'
import { DEFAULT_EXAM_KEY, resolveExamKey } from '@/types/exams'
import { parseExamKeyFromPath } from '@/utils/examRoutes'
import { inferExamKeyFromPaper } from '@/utils/paperData'

/**
 * Reads `examKey` from the route when present; falls back to parsing the
 * pathname or inferring from year+paper so Rajasthan MO back-links stay correct.
 */
export function useExamKeyParam(): ExamKey {
  const { examKey, year, paper } = useParams<{
    examKey?: string
    year?: string
    paper?: string
  }>()
  const { pathname } = useLocation()

  if (examKey) return resolveExamKey(examKey)

  const fromPath = parseExamKeyFromPath(pathname)
  if (fromPath) return fromPath

  if (year && paper) return inferExamKeyFromPaper(year, paper)

  return DEFAULT_EXAM_KEY
}
