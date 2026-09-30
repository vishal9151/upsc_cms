import type {
  NeetpgFilterBounds,
  NeetpgFilterState,
  RankMode,
} from '@/types/neetpgCutoff'
import { createDefaultFilterState } from '@/utils/neetpgFilters'

interface NeetpgSessionPayload {
  filters: NeetpgFilterState
  rankMode: RankMode
}

function storageKey(datasetId: string): string {
  return `neetpg-cutoff-session:${datasetId}`
}

export function loadNeetpgSession(
  datasetId: string,
  bounds: NeetpgFilterBounds,
): NeetpgSessionPayload {
  const defaults: NeetpgSessionPayload = {
    filters: createDefaultFilterState(bounds),
    rankMode: 'state',
  }

  if (typeof sessionStorage === 'undefined') return defaults

  try {
    const raw = sessionStorage.getItem(storageKey(datasetId))
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Partial<NeetpgSessionPayload>
    const base = createDefaultFilterState(bounds)
    return {
      rankMode: parsed.rankMode === 'air' ? 'air' : 'state',
      filters: {
        ...base,
        ...parsed.filters,
        feeMin: Math.max(
          bounds.feeMin,
          Math.min(parsed.filters?.feeMin ?? base.feeMin, bounds.feeMax),
        ),
        feeMax: Math.min(
          bounds.feeMax,
          Math.max(parsed.filters?.feeMax ?? base.feeMax, bounds.feeMin),
        ),
        stipendMin: Math.max(
          bounds.stipendMin,
          Math.min(parsed.filters?.stipendMin ?? base.stipendMin, bounds.stipendMax),
        ),
        stipendMax: Math.min(
          bounds.stipendMax,
          Math.max(parsed.filters?.stipendMax ?? base.stipendMax, bounds.stipendMin),
        ),
      },
    }
  } catch {
    return defaults
  }
}

export function saveNeetpgSession(
  datasetId: string,
  payload: NeetpgSessionPayload,
): void {
  if (typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.setItem(storageKey(datasetId), JSON.stringify(payload))
  } catch {
    // ignore quota errors
  }
}
