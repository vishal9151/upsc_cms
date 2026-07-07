export interface Question {
  id: number
  question: string
  options: [string, string, string, string]
  correctAnswer: number
  explanation: string
}

export type PaperId = 'paper1' | 'paper2'

export type PaletteStatus =
  | 'not-visited'
  | 'visited'
  | 'answered'
  | 'marked'
  | 'answered-marked'

export interface ExamMeta {
  year: string
  paper: string
}
