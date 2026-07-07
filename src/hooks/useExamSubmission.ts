import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitCurrentExam } from '@/utils/examSubmission'

export function useExamSubmission() {
  const navigate = useNavigate()

  const submitAndNavigate = useCallback(
    (autoSubmitted = false) => {
      const result = submitCurrentExam(autoSubmitted)
      if (!result) return

      navigate(`/result/${result.year}/${result.paper}`, {
        state: { autoSubmitted },
      })
    },
    [navigate],
  )

  return { submitAndNavigate }
}
