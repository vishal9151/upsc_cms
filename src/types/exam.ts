import type { SubjectKey } from './subject'

export interface Question {
  id: number
  question: string
  options: [string, string, string, string]
  correctAnswer: number
  explanation: string
  subject_keys: SubjectKey[]
}

export type PaperId = 'paper1' | 'paper2'

export type PaletteStatus =
  | 'not-visited'
  | 'visited'
  | 'answered'
  | 'marked'
  | 'answered-marked'

export type ExamMode = 'pyq' | 'practice'

export interface ExamMeta {
  year: string
  paper: string
  examMode?: ExamMode
  isTimed?: boolean
  practiceLabel?: string
}
