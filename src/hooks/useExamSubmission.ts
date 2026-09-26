import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExamKeyParam } from '@/hooks/useExamKeyParam'
import { getResultPath } from '@/utils/examRoutes'
import { submitCurrentExam } from '@/utils/examSubmission'

export function useExamSubmission() {
  const navigate = useNavigate()
  const examKey = useExamKeyParam()

  const submitAndNavigate = useCallback(
    (autoSubmitted = false) => {
      const result = submitCurrentExam(autoSubmitted)
      if (!result) return

      navigate(getResultPath(examKey, result.year, result.paper), {
        state: { autoSubmitted },
      })
    },
    [navigate, examKey],
  )

  return { submitAndNavigate }
}
