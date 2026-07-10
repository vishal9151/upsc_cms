import { useExamStore } from '@/store/examStore'
import { EXAM_DURATION_SECONDS } from '@/utils/examHelpers'
import { deleteExam } from '@/utils/examStorage'
import { processExamSubmission } from '@/utils/resultStorage'

export function submitCurrentExam(autoSubmitted = false) {
  const state = useExamStore.getState()

  if (!state.year || !state.paper || state.questions.length === 0) {
    return null
  }

  if (state.submitted) {
    return null
  }

  const timeTakenSeconds = state.isTimed
    ? EXAM_DURATION_SECONDS - state.remainingTime
    : 0

  const result = processExamSubmission({
    year: state.year,
    paper: state.paper,
    questions: state.questions,
    answers: state.answers,
    markedForReview: state.markedForReview,
    timeTakenSeconds,
    autoSubmitted,
  })

  deleteExam(state.year, state.paper)

  useExamStore.setState({
    submitted: true,
    examCompleted: true,
    showSubmitModal: false,
  })

  return result
}
