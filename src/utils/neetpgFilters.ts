import type {
  CutoffRecord,
  NeetpgFilterBounds,
  NeetpgFilterState,
} from '@/types/neetpgCutoff'

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b))
}

export function deriveFilterBounds(records: CutoffRecord[]): NeetpgFilterBounds {
  let feeMin = Infinity
  let feeMax = -Infinity
  let stipendMin = Infinity
  let stipendMax = -Infinity
  const rounds = new Set<number>()

  for (const record of records) {
    if (record.fee != null) {
      feeMin = Math.min(feeMin, record.fee)
      feeMax = Math.max(feeMax, record.fee)
    }
    if (record.stipend != null) {
      stipendMin = Math.min(stipendMin, record.stipend)
      stipendMax = Math.max(stipendMax, record.stipend)
    }
    for (const round of record.rounds) {
      rounds.add(round.round)
    }
  }

  return {
    feeMin: Number.isFinite(feeMin) ? feeMin : 0,
    feeMax: Number.isFinite(feeMax) ? feeMax : 0,
    stipendMin: Number.isFinite(stipendMin) ? stipendMin : 0,
    stipendMax: Number.isFinite(stipendMax) ? stipendMax : 0,
    institutes: uniqueSorted(records.map((r) => r.institute)),
    courses: uniqueSorted(records.map((r) => r.course)),
    quotas: uniqueSorted(records.map((r) => r.quota)),
    categories: uniqueSorted(records.map((r) => r.category)),
    rounds: [...rounds].sort((a, b) => a - b),
  }
}

export function createDefaultFilterState(bounds: NeetpgFilterBounds): NeetpgFilterState {
  return {
    selectedRounds: [],
    selectedChanceLevels: [],
    institutes: [],
    courses: [],
    quotas: [],
    categories: [],
    feeMin: bounds.feeMin,
    feeMax: bounds.feeMax,
    stipendMin: bounds.stipendMin,
    stipendMax: bounds.stipendMax,
  }
}

function inRange(
  value: number | null,
  min: number,
  max: number,
  boundsMin: number,
  boundsMax: number,
): boolean {
  const filterActive = min > boundsMin || max < boundsMax
  if (!filterActive) return true
  if (value == null) return false
  return value >= min && value <= max
}

export function filterCutoffRecords(
  records: CutoffRecord[],
  filters: NeetpgFilterState,
  bounds: NeetpgFilterBounds,
): CutoffRecord[] {
  return records.filter((record) => {
    if (
      filters.selectedRounds.length > 0 &&
      !record.rounds.some((r) => filters.selectedRounds.includes(r.round))
    ) {
      return false
    }

    if (
      filters.institutes.length > 0 &&
      !filters.institutes.includes(record.institute)
    ) {
      return false
    }

    if (
      filters.courses.length > 0 &&
      !filters.courses.includes(record.course)
    ) {
      return false
    }

    if (filters.quotas.length > 0 && !filters.quotas.includes(record.quota)) {
      return false
    }

    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(record.category)
    ) {
      return false
    }

    if (
      !inRange(
        record.fee,
        filters.feeMin,
        filters.feeMax,
        bounds.feeMin,
        bounds.feeMax,
      )
    ) {
      return false
    }

    if (
      !inRange(
        record.stipend,
        filters.stipendMin,
        filters.stipendMax,
        bounds.stipendMin,
        bounds.stipendMax,
      )
    ) {
      return false
    }

    return true
  })
}

export interface InstituteGroup {
  institute: string
  branches: CutoffRecord[]
}

export function groupByInstitute(records: CutoffRecord[]): InstituteGroup[] {
  const map = new Map<string, CutoffRecord[]>()

  for (const record of records) {
    const list = map.get(record.institute) ?? []
    list.push(record)
    map.set(record.institute, list)
  }

  return [...map.entries()]
    .map(([institute, branches]) => ({
      institute,
      branches: branches.sort((a, b) =>
        `${a.course}${a.quota}${a.category}`.localeCompare(
          `${b.course}${b.quota}${b.category}`,
        ),
      ),
    }))
    .sort((a, b) => a.institute.localeCompare(b.institute))
}
