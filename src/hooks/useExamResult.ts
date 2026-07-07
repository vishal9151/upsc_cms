import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { loadExamResult } from '@/utils/resultStorage'
import { getPaperQuestions } from '@/utils/paperData'

export function useExamResult() {
  const { year, paper } = useParams<{ year: string; paper: string }>()

  return useMemo(() => {
    if (!year || !paper) return null
    const result = loadExamResult(year, paper)
    if (!result) return null

    const questions = getPaperQuestions(year, paper)

    return { ...result, questions }
  }, [year, paper])
}
