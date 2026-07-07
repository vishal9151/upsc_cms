import { DEFAULT_SCORING, type ScoringConfig } from '@/config/scoring'
import type { Question } from '@/types/exam'
import type {
  ExamResultSummary,
  QuestionResult,
  QuestionResultStatus,
} from '@/types/result'

export interface CalculateResultInput {
  year: string
  paper: string
  questions: Question[]
  answers: Record<number, number>
  markedForReview: number[]
  timeTakenSeconds: number
  autoSubmitted?: boolean
  scoring?: ScoringConfig
}

function getQuestionStatus(
  userAnswer: number | undefined,
  correctAnswer: number,
): QuestionResultStatus {
  if (userAnswer === undefined) return 'skipped'
  return userAnswer === correctAnswer ? 'correct' : 'incorrect'
}

export function calculateQuestionResults(
  questions: Question[],
  answers: Record<number, number>,
  markedForReview: number[],
): QuestionResult[] {
  return questions.map((question, index) => {
    const userAnswer = answers[index]
    return {
      index,
      questionId: question.id,
      status: getQuestionStatus(userAnswer, question.correctAnswer),
      userAnswer: userAnswer ?? null,
      correctAnswer: question.correctAnswer,
      isMarked: markedForReview.includes(index),
    }
  })
}

export function calculateExamResult(
  input: CalculateResultInput,
): {
  summary: ExamResultSummary
  questionResults: QuestionResult[]
} {
  const scoring = input.scoring ?? DEFAULT_SCORING
  const questionResults = calculateQuestionResults(
    input.questions,
    input.answers,
    input.markedForReview,
  )

  const totalQuestions = input.questions.length
  const correct = questionResults.filter((q) => q.status === 'correct').length
  const incorrect = questionResults.filter((q) => q.status === 'incorrect').length
  const skipped = questionResults.filter((q) => q.status === 'skipped').length
  const attempted = correct + incorrect

  const score =
    correct * scoring.positiveMarks - incorrect * scoring.negativeMarks
  const maxScore = totalQuestions * scoring.positiveMarks
  const accuracy =
    attempted > 0 ? Math.round((correct / attempted) * 100) : 0
  const scorePercent =
    maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

  const summary: ExamResultSummary = {
    attemptId: crypto.randomUUID(),
    totalQuestions,
    attempted,
    correct,
    incorrect,
    skipped,
    accuracy,
    score,
    maxScore,
    scorePercent,
    timeTakenSeconds: input.timeTakenSeconds,
    submittedAt: new Date().toISOString(),
    autoSubmitted: input.autoSubmitted ?? false,
  }

  return { summary, questionResults }
}
