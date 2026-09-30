import { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  ChanceLevel,
  CutoffRecord,
  NeetpgDatasetMeta,
  NeetpgFilterState,
  RankMode,
} from '@/types/neetpgCutoff'
import {
  bestChanceLevel,
  CHANCE_LEVEL_ORDER,
  compareChanceLevels,
  computeChanceLevel,
} from '@/utils/neetpgChances'
import {
  createDefaultFilterState,
  deriveFilterBounds,
  filterCutoffRecords,
  groupByInstitute,
  type InstituteGroup,
} from '@/utils/neetpgFilters'
import { loadNeetpgSession, saveNeetpgSession } from '@/utils/neetpgSession'

interface UseNeetpgCutoffToolOptions {
  datasetId: string
  /** When set, drives chance results (results page). Entry page leaves this null. */
  submittedRank: number | null
  initialRankMode?: RankMode
  initialFilters?: NeetpgFilterState
}

export function useNeetpgCutoffTool(
  records: CutoffRecord[],
  _datasetMeta: NeetpgDatasetMeta,
  options: UseNeetpgCutoffToolOptions,
) {
  const { datasetId, submittedRank } = options
  const bounds = useMemo(() => deriveFilterBounds(records), [records])

  const sessionDefaults = useMemo(
    () => loadNeetpgSession(datasetId, bounds),
    [datasetId, bounds],
  )

  const [rankMode, setRankMode] = useState<RankMode>(
    options.initialRankMode ?? sessionDefaults.rankMode,
  )
  const [userRankInput, setUserRankInput] = useState(
    submittedRank != null ? String(submittedRank) : '',
  )
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filters, setFilters] = useState<NeetpgFilterState>(
    options.initialFilters ?? sessionDefaults.filters,
  )

  useEffect(() => {
    if (submittedRank != null) {
      setUserRankInput(String(submittedRank))
    }
  }, [submittedRank])

  const persistSession = useCallback(
    (nextFilters: NeetpgFilterState, nextMode: RankMode) => {
      saveNeetpgSession(datasetId, { filters: nextFilters, rankMode: nextMode })
    },
    [datasetId],
  )

  useEffect(() => {
    persistSession(filters, rankMode)
  }, [filters, rankMode, persistSession])

  const userRank = useMemo(() => {
    const parsed = Number.parseInt(userRankInput.trim(), 10)
    if (!Number.isFinite(parsed) || parsed <= 0) return null
    return parsed
  }, [userRankInput])

  const activeRank = submittedRank ?? null

  const filteredRecords = useMemo(
    () => filterCutoffRecords(records, filters, bounds),
    [records, filters, bounds],
  )

  const instituteGroups: InstituteGroup[] = useMemo(() => {
    if (activeRank === null) return []
    return groupByInstitute(filteredRecords)
  }, [filteredRecords, activeRank])

  const instituteGroupsWithChance = useMemo(() => {
    if (activeRank === null) return []

    const withChance = instituteGroups.map((group) => {
      let branchChances = group.branches.map((branch) => ({
        branch,
        chance: computeChanceLevel(branch, activeRank, rankMode),
      }))

      if (filters.selectedChanceLevels.length > 0) {
        branchChances = branchChances.filter((entry) =>
          filters.selectedChanceLevels.includes(entry.chance),
        )
      }

      branchChances.sort((a, b) => {
        const byChance = compareChanceLevels(a.chance, b.chance)
        if (byChance !== 0) return byChance
        return a.branch.course.localeCompare(b.branch.course)
      })

      const best = bestChanceLevel(branchChances.map((b) => b.chance))
      return { ...group, branchChances, bestChance: best }
    })

    return withChance
      .filter((group) => group.branchChances.length > 0)
      .sort((a, b) => {
        const aOrder = a.bestChance ? CHANCE_LEVEL_ORDER[a.bestChance] : 0
        const bOrder = b.bestChance ? CHANCE_LEVEL_ORDER[b.bestChance] : 0
        if (bOrder !== aOrder) return bOrder - aOrder
        return a.institute.localeCompare(b.institute)
      })
  }, [instituteGroups, activeRank, rankMode, filters.selectedChanceLevels])

  const toggleChanceLevel = (level: ChanceLevel) => {
    setFilters((prev) => {
      const has = prev.selectedChanceLevels.includes(level)
      return {
        ...prev,
        selectedChanceLevels: has
          ? prev.selectedChanceLevels.filter((l) => l !== level)
          : [...prev.selectedChanceLevels, level],
      }
    })
  }

  const toggleRound = (round: number) => {
    setFilters((prev) => {
      const has = prev.selectedRounds.includes(round)
      return {
        ...prev,
        selectedRounds: has
          ? prev.selectedRounds.filter((r) => r !== round)
          : [...prev.selectedRounds, round].sort((a, b) => a - b),
      }
    })
  }

  const toggleInList = (
    key: 'institutes' | 'courses' | 'quotas' | 'categories',
    value: string,
  ) => {
    setFilters((prev) => {
      const list = prev[key]
      const has = list.includes(value)
      return {
        ...prev,
        [key]: has ? list.filter((v) => v !== value) : [...list, value],
      }
    })
  }

  const resetFilters = () => {
    setFilters(createDefaultFilterState(bounds))
  }

  return {
    bounds,
    rankMode,
    setRankMode,
    userRankInput,
    setUserRankInput,
    userRank,
    activeRank,
    filtersOpen,
    setFiltersOpen,
    filters,
    setFilters,
    toggleRound,
    toggleChanceLevel,
    toggleInList,
    resetFilters,
    instituteGroupsWithChance,
    filteredCount: filteredRecords.length,
    displayedBranchCount: instituteGroupsWithChance.reduce(
      (sum, g) => sum + g.branchChances.length,
      0,
    ),
  }
}
