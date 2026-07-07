export interface ScoringConfig {
  positiveMarks: number
  negativeMarks: number
}

export const DEFAULT_SCORING: ScoringConfig = {
  positiveMarks: 1,
  negativeMarks: 0,
}
