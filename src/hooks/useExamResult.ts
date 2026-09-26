import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useExamKeyParam } from '@/hooks/useExamKeyParam'
import { loadExamResult } from '@/utils/resultStorage'
import { resolveExamQuestions } from '@/utils/questionResolver'

export function useExamResult() {
  const { year, paper } = useParams<{ year: string; paper: string }>()
  const examKey = useExamKeyParam()

  return useMemo(() => {
    if (!year || !paper) return null
    const result = loadExamResult(year, paper)
    if (!result) return null

    const questions = resolveExamQuestions(year, paper, examKey)

    return { ...result, questions, examKey }
  }, [year, paper, examKey])
}
