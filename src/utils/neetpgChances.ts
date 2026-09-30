import {
  ALL_INDIA_QUOTA,
  type ChanceLevel,
  type CutoffRecord,
  type RankMode,
} from '@/types/neetpgCutoff'

export const CHANCE_LEVEL_ORDER: Record<ChanceLevel, number> = {
  high: 4,
  moderate: 3,
  low: 2,
  veryLow: 1,
}

/** Best (highest) chance first */
export const CHANCE_LEVELS_DESC: ChanceLevel[] = [
  'high',
  'moderate',
  'low',
  'veryLow',
]

export function compareChanceLevels(a: ChanceLevel, b: ChanceLevel): number {
  return CHANCE_LEVEL_ORDER[b] - CHANCE_LEVEL_ORDER[a]
}

export const CHANCE_LABELS: Record<ChanceLevel, string> = {
  high: 'High Chance',
  moderate: 'Moderate Chance',
  low: 'Low Chance',
  veryLow: 'Very Low / No Chance',
}

export function usesAirForBranch(record: CutoffRecord, rankMode: RankMode): boolean {
  if (record.quota === ALL_INDIA_QUOTA) return true
  return rankMode === 'air'
}

function getRound1Closing(record: CutoffRecord, useAir: boolean): number | null {
  const round1 = record.rounds.find((r) => r.round === 1)
  if (!round1) return null
  return useAir ? round1.closingAir : round1.closingStateRank
}

function getOverallOpening(record: CutoffRecord, useAir: boolean): number {
  return useAir ? record.overall.openingAir : record.overall.openingStateRank
}

function getOverallClosing(record: CutoffRecord, useAir: boolean): number {
  return useAir ? record.overall.closingAir : record.overall.closingStateRank
}

export function computeChanceLevel(
  record: CutoffRecord,
  userRank: number,
  rankMode: RankMode,
): ChanceLevel {
  const useAir = usesAirForBranch(record, rankMode)
  const round1Closing = getRound1Closing(record, useAir)
  const overallOpening = getOverallOpening(record, useAir)
  const overallClosing = getOverallClosing(record, useAir)

  if (round1Closing !== null && userRank <= round1Closing) {
    return 'high'
  }

  const moderateLower =
    round1Closing !== null ? round1Closing : overallOpening

  if (userRank > moderateLower && userRank <= overallClosing) {
    return 'moderate'
  }

  if (userRank > overallClosing && userRank <= overallClosing * 1.15) {
    return 'low'
  }

  return 'veryLow'
}

export function bestChanceLevel(
  levels: ChanceLevel[],
): ChanceLevel | null {
  if (levels.length === 0) return null
  return levels.reduce((best, current) =>
    CHANCE_LEVEL_ORDER[current] > CHANCE_LEVEL_ORDER[best] ? current : best,
  )
}

export const CHANCE_LOGIC_TOOLTIP =
  'High: within round 1 closing. Moderate: after round 1 but within final closing. Low: up to ~15% above final closing. Very low: beyond that. All-India quota seats always use AIR.'
