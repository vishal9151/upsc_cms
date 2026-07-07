import type { PaletteStatus, Question } from '@/types/exam'
import { EXAM_DURATION_MINUTES } from '@/utils/paperData'

export const EXAM_DURATION_SECONDS = EXAM_DURATION_MINUTES * 60

/** Uses questions from JSON as-is — no padding or truncation. */
export function preparePaperQuestions(questions: Question[]): Question[] {
  return questions
}

export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return [hrs, mins, secs].map((v) => String(v).padStart(2, '0')).join(':')
}

export function getQuestionStatus(
  index: number,
  visitedQuestions: number[],
  answers: Record<number, number>,
  markedForReview: number[],
): PaletteStatus {
  const isVisited = visitedQuestions.includes(index)
  const isAnswered = answers[index] !== undefined
  const isMarked = markedForReview.includes(index)

  if (isAnswered && isMarked) return 'answered-marked'
  if (isAnswered) return 'answered'
  if (isMarked) return 'marked'
  if (isVisited) return 'visited'
  return 'not-visited'
}

export function getAnsweredAndReviewIndices(
  answers: Record<number, number>,
  markedForReview: number[],
): number[] {
  return markedForReview.filter((index) => answers[index] !== undefined)
}

export const paletteStatusStyles: Record<PaletteStatus, string> = {
  'not-visited':
    'border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400',
  visited:
    'border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-700 dark:bg-blue-950 dark:text-blue-300',
  answered:
    'border-green-300 bg-green-100 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300',
  marked:
    'border-purple-300 bg-purple-100 text-purple-700 dark:border-purple-700 dark:bg-purple-950 dark:text-purple-300',
  'answered-marked':
    'border-purple-500 bg-green-100 text-green-800 ring-2 ring-purple-400 dark:border-purple-500 dark:bg-green-950 dark:text-green-300 dark:ring-purple-600',
}

export const paletteLegendItems: {
  status: PaletteStatus
  label: string
  swatchClass: string
}[] = [
  {
    status: 'not-visited',
    label: 'Not Visited',
    swatchClass: 'bg-gray-200 dark:bg-gray-700',
  },
  {
    status: 'visited',
    label: 'Visited',
    swatchClass: 'bg-blue-200 dark:bg-blue-800',
  },
  {
    status: 'answered',
    label: 'Answered',
    swatchClass: 'bg-green-200 dark:bg-green-800',
  },
  {
    status: 'marked',
    label: 'Marked',
    swatchClass: 'bg-purple-200 dark:bg-purple-800',
  },
  {
    status: 'answered-marked',
    label: 'Answered & Marked',
    swatchClass:
      'bg-green-200 ring-2 ring-purple-400 dark:bg-green-800 dark:ring-purple-600',
  },
]
