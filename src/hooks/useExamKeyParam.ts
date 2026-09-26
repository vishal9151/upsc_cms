import { useParams } from 'react-router-dom'
import type { ExamKey } from '@/types/exams'
import { DEFAULT_EXAM_KEY, resolveExamKey } from '@/types/exams'

/**
 * Reads `examKey` from the route when present; defaults to `"cms"` so
 * legacy `/exam/:year/:paper` routes keep working unchanged.
 */
export function useExamKeyParam(): ExamKey {
  const { examKey } = useParams<{ examKey?: string }>()
  return examKey ? resolveExamKey(examKey) : DEFAULT_EXAM_KEY
}
