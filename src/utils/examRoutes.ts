import { DEFAULT_EXAM_KEY, type ExamKey } from '@/types/exams'

/** Path to the paper list for an exam (or home selector when omitted). */
export function getExamListPath(examKey?: ExamKey | null): string {
  if (!examKey) return '/'
  return `/exams/${examKey}`
}

/**
 * Build exam-taking URLs.
 * CMS keeps legacy `/exam/:year/:paper` paths for backward compatibility.
 * Other exams use `/exams/:examKey/exam/:year/:paper`.
 */
export function getExamPath(
  examKey: ExamKey,
  year: string,
  paper: string,
  suffix: '' | '/instructions' = '',
): string {
  if (examKey === DEFAULT_EXAM_KEY) {
    return `/exam/${year}/${paper}${suffix}`
  }
  return `/exams/${examKey}/exam/${year}/${paper}${suffix}`
}

export function getResultPath(
  examKey: ExamKey,
  year: string,
  paper: string,
): string {
  if (examKey === DEFAULT_EXAM_KEY) {
    return `/result/${year}/${paper}`
  }
  return `/exams/${examKey}/result/${year}/${paper}`
}

export function getReviewPath(
  examKey: ExamKey,
  year: string,
  paper: string,
): string {
  if (examKey === DEFAULT_EXAM_KEY) {
    return `/review/${year}/${paper}`
  }
  return `/exams/${examKey}/review/${year}/${paper}`
}

export function getPracticePath(
  examKey: ExamKey,
  kind: 'custom' | 'topics' | 'high-yield' = 'custom',
): string {
  const suffix =
    kind === 'custom' ? '' : kind === 'topics' ? '/topics' : '/high-yield'
  if (examKey === DEFAULT_EXAM_KEY) {
    return `/practice${suffix}`
  }
  return `/exams/${examKey}/practice${suffix}`
}

export function getPracticeInstructionsPath(testId: string): string {
  return `/practice/${testId}/instructions`
}
