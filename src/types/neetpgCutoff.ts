export interface CutoffRound {
  round: number
  seatsAllotted: number
  openingAir: number
  closingAir: number
  openingStateRank: number
  closingStateRank: number
}

export interface CutoffOverall {
  openingAir: number
  closingAir: number
  openingStateRank: number
  closingStateRank: number
}

export interface CutoffRecord {
  id: number
  institute: string
  course: string
  quota: string
  category: string
  fee: number | null
  stipend: number | null
  bondYears: number | null
  bondPenalty: number | null
  totalSeatsAllotted: number
  rounds: CutoffRound[]
  overall: CutoffOverall
}

export interface NeetpgDatasetMeta {
  id: string
  label: string
  state: string
  year: number
  file: string
  totalRecords: number
  totalInstitutes: number
  rounds: number[]
  source: string
  disclaimer: string
}

export interface NeetpgCutoffIndex {
  tool: string
  label: string
  datasets: NeetpgDatasetMeta[]
}

export type RankMode = 'state' | 'air'

export type ChanceLevel = 'high' | 'moderate' | 'low' | 'veryLow'

export const ALL_INDIA_QUOTA = 'Private Seats - All India (Eligibility)'

export interface NeetpgFilterState {
  selectedRounds: number[]
  /** Empty = all chance tiers; set only after rank is applied in the hook */
  selectedChanceLevels: ChanceLevel[]
  institutes: string[]
  courses: string[]
  quotas: string[]
  categories: string[]
  feeMin: number
  feeMax: number
  stipendMin: number
  stipendMax: number
}

export interface NeetpgFilterBounds {
  feeMin: number
  feeMax: number
  stipendMin: number
  stipendMax: number
  institutes: string[]
  courses: string[]
  quotas: string[]
  categories: string[]
  rounds: number[]
}
