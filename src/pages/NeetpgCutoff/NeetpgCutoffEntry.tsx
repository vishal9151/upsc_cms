import { useNavigate, useParams } from 'react-router-dom'
import {
  NeetpgFiltersPanel,
  NeetpgPageHeader,
  RankInputSection,
} from '@/components/neetpg'
import { Button } from '@/components/ui/Button'
import { useNeetpgCutoffTool } from '@/hooks/useNeetpgCutoffTool'
import { getNeetpgDataset } from '@/utils/neetpgCutoffData'
import { saveNeetpgSession } from '@/utils/neetpgSession'
import { NotFound } from '@/pages/NotFound'

export function NeetpgCutoffEntry() {
  const { datasetId } = useParams<{ datasetId: string }>()
  const navigate = useNavigate()
  const dataset = datasetId ? getNeetpgDataset(datasetId) : null

  if (!dataset || !datasetId) {
    return <NotFound />
  }

  const { meta, records } = dataset
  const tool = useNeetpgCutoffTool(records, meta, {
    datasetId,
    submittedRank: null,
  })

  const handleSubmit = () => {
    if (tool.userRank === null) return
    saveNeetpgSession(datasetId, {
      filters: tool.filters,
      rankMode: tool.rankMode,
    })
    const params = new URLSearchParams({
      rank: String(tool.userRank),
      mode: tool.rankMode,
    })
    navigate(`/neetpg-cutoff/${datasetId}/results?${params.toString()}`)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 pb-12 sm:space-y-6">
      <NeetpgPageHeader
        meta={meta}
        backTo="/neetpg-cutoff"
        backLabel="All datasets"
        subtitle="Enter your rank and optional filters, then view chances."
      />

      <RankInputSection
        userRankInput={tool.userRankInput}
        onUserRankInputChange={tool.setUserRankInput}
        rankMode={tool.rankMode}
        onRankModeChange={tool.setRankMode}
      />

      <NeetpgFiltersPanel
        open={tool.filtersOpen}
        onOpenChange={tool.setFiltersOpen}
        showChanceFilter={false}
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

      <p className="text-center text-xs text-gray-500 dark:text-gray-400 sm:text-left">
        Optional filters above apply on the results page. You can change them
        again after submitting your rank.
      </p>

      <Button
        className="min-h-12 w-full text-base sm:max-w-xs"
        disabled={tool.userRank === null}
        onClick={handleSubmit}
      >
        Show my chances
      </Button>
    </div>
  )
}
