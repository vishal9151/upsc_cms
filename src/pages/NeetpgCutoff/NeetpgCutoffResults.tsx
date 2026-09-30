import { useEffect, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  InstituteResultsList,
  NeetpgFiltersPanel,
  NeetpgPageHeader,
} from '@/components/neetpg'
import { Badge } from '@/components/ui/Badge'
import { useNeetpgCutoffTool } from '@/hooks/useNeetpgCutoffTool'
import type { RankMode } from '@/types/neetpgCutoff'
import { getNeetpgDataset } from '@/utils/neetpgCutoffData'
import { NotFound } from '@/pages/NotFound'

function parseSubmittedRank(searchParams: URLSearchParams): number | null {
  const parsed = Number.parseInt(searchParams.get('rank') ?? '', 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

function parseRankMode(searchParams: URLSearchParams): RankMode {
  return searchParams.get('mode') === 'air' ? 'air' : 'state'
}

export function NeetpgCutoffResults() {
  const { datasetId } = useParams<{ datasetId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dataset = datasetId ? getNeetpgDataset(datasetId) : null

  const submittedRank = useMemo(
    () => parseSubmittedRank(searchParams),
    [searchParams],
  )
  const rankModeFromUrl = useMemo(
    () => parseRankMode(searchParams),
    [searchParams],
  )

  useEffect(() => {
    if (!datasetId || submittedRank !== null) return
    navigate(`/neetpg-cutoff/${datasetId}`, { replace: true })
  }, [datasetId, submittedRank, navigate])

  if (!dataset || !datasetId || submittedRank === null) {
    return submittedRank === null && dataset ? null : <NotFound />
  }

  const { meta, records } = dataset
  const tool = useNeetpgCutoffTool(records, meta, {
    datasetId,
    submittedRank,
    initialRankMode: rankModeFromUrl,
  })

  return (
    <div className="mx-auto max-w-4xl space-y-4 pb-12 sm:space-y-6">
      <NeetpgPageHeader
        meta={meta}
        backTo={`/neetpg-cutoff/${datasetId}`}
        backLabel="Change rank"
        subtitle="Refine filters below; results update instantly."
      />

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/50">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Your rank
        </span>
        <Badge variant="blue" className="text-sm">
          {submittedRank}
        </Badge>
        <span className="text-sm text-gray-500">
          ({tool.rankMode === 'state' ? 'State Rank' : 'AIR'})
        </span>
      </div>

      <NeetpgFiltersPanel
        open={tool.filtersOpen}
        onOpenChange={tool.setFiltersOpen}
        showChanceFilter
        bounds={tool.bounds}
        filters={tool.filters}
        onToggleRound={tool.toggleRound}
        onToggleChanceLevel={tool.toggleChanceLevel}
        onToggleInstitute={(v) => tool.toggleInList('institutes', v)}
        onToggleCourse={(v) => tool.toggleInList('courses', v)}
        onToggleQuota={(v) => tool.toggleInList('quotas', v)}
        onToggleCategory={(v) => tool.toggleInList('categories', v)}
        onFiltersChange={(patch) =>
          tool.setFilters((prev) => ({ ...prev, ...patch }))
        }
        onReset={tool.resetFilters}
      />

      <InstituteResultsList
        groups={tool.instituteGroupsWithChance}
        source={meta.source}
        disclaimer={meta.disclaimer}
        matchCount={tool.displayedBranchCount}
      />
    </div>
  )
}
