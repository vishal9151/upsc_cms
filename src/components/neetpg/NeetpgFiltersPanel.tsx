import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react'
import { PracticeFilterChip } from '@/components/practice/PracticeFilterChip'
import { Button } from '@/components/ui/Button'
import { ResponsiveModal } from '@/components/ui/ResponsiveModal'
import type {
  ChanceLevel,
  NeetpgFilterBounds,
  NeetpgFilterState,
} from '@/types/neetpgCutoff'
import {
  CHANCE_LABELS,
  CHANCE_LEVELS_DESC,
} from '@/utils/neetpgChances'
import { SearchableMultiSelect } from '@/components/neetpg/SearchableMultiSelect'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'

interface NeetpgFiltersPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Hide chance tier chips until rank is submitted (results page). */
  showChanceFilter?: boolean
  bounds: NeetpgFilterBounds
  filters: NeetpgFilterState
  onToggleRound: (round: number) => void
  onToggleChanceLevel: (level: ChanceLevel) => void
  onToggleInstitute: (value: string) => void
  onToggleCourse: (value: string) => void
  onToggleQuota: (value: string) => void
  onToggleCategory: (value: string) => void
  onFiltersChange: (patch: Partial<NeetpgFilterState>) => void
  onReset: () => void
}

function formatInr(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function countActiveNeetpgFilters(
  filters: NeetpgFilterState,
  bounds: NeetpgFilterBounds,
): number {
  let count = 0
  if (filters.selectedRounds.length > 0) count++
  if (filters.selectedChanceLevels.length > 0) count++
  if (filters.institutes.length > 0) count++
  if (filters.courses.length > 0) count++
  if (filters.quotas.length > 0) count++
  if (filters.categories.length > 0) count++
  if (filters.feeMin > bounds.feeMin || filters.feeMax < bounds.feeMax) count++
  if (
    filters.stipendMin > bounds.stipendMin ||
    filters.stipendMax < bounds.stipendMax
  ) {
    count++
  }
  return count
}

interface NeetpgFiltersContentProps {
  bounds: NeetpgFilterBounds
  filters: NeetpgFilterState
  onToggleRound: (round: number) => void
  onToggleChanceLevel: (level: ChanceLevel) => void
  onToggleInstitute: (value: string) => void
  onToggleCourse: (value: string) => void
  onToggleQuota: (value: string) => void
  onToggleCategory: (value: string) => void
  onFiltersChange: (patch: Partial<NeetpgFilterState>) => void
  onReset: () => void
  showChanceFilter?: boolean
  className?: string
}

function NeetpgFiltersContent({
  bounds,
  filters,
  showChanceFilter = true,
  onToggleRound,
  onToggleChanceLevel,
  onToggleInstitute,
  onToggleCourse,
  onToggleQuota,
  onToggleCategory,
  onFiltersChange,
  onReset,
  className,
}: NeetpgFiltersContentProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {showChanceFilter && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Chance
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Results are ordered High → Moderate → Low → Very low. Select tiers to
            narrow the list.
          </p>
          <div className="flex flex-wrap gap-2">
            {CHANCE_LEVELS_DESC.map((level) => (
              <PracticeFilterChip
                key={level}
                label={CHANCE_LABELS[level]}
                selected={filters.selectedChanceLevels.includes(level)}
                onClick={() => onToggleChanceLevel(level)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Round
        </p>
        <div className="flex flex-wrap gap-2">
          {bounds.rounds.map((round) => (
            <PracticeFilterChip
              key={round}
              label={`Round ${round}`}
              selected={filters.selectedRounds.includes(round)}
              onClick={() => onToggleRound(round)}
            />
          ))}
        </div>
      </div>

      <SearchableMultiSelect
        label="Institute"
        options={bounds.institutes}
        selected={filters.institutes}
        onToggle={onToggleInstitute}
        maxHeightClass="max-h-36 sm:max-h-40"
      />

      <SearchableMultiSelect
        label="Course"
        options={bounds.courses}
        selected={filters.courses}
        onToggle={onToggleCourse}
        maxHeightClass="max-h-36 sm:max-h-40"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Quota
        </p>
        <div className="flex flex-wrap gap-2">
          {bounds.quotas.map((quota) => (
            <PracticeFilterChip
              key={quota}
              label={quota}
              selected={filters.quotas.includes(quota)}
              onClick={() => onToggleQuota(quota)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Category
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Reserved-category candidates are also eligible for GEN seats; select
          GEN as well if you want to see those too.
        </p>
        <div className="flex flex-wrap gap-2">
          {bounds.categories.map((category) => (
            <PracticeFilterChip
              key={category}
              label={category}
              selected={filters.categories.includes(category)}
              onClick={() => onToggleCategory(category)}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">Fee range</p>
          <p className="text-xs text-gray-500">
            {formatInr(filters.feeMin)} – {formatInr(filters.feeMax)}
          </p>
          <input
            type="range"
            min={bounds.feeMin}
            max={bounds.feeMax}
            value={filters.feeMin}
            onChange={(e) =>
              onFiltersChange({
                feeMin: Math.min(Number(e.target.value), filters.feeMax),
              })
            }
            className="w-full touch-none"
          />
          <input
            type="range"
            min={bounds.feeMin}
            max={bounds.feeMax}
            value={filters.feeMax}
            onChange={(e) =>
              onFiltersChange({
                feeMax: Math.max(Number(e.target.value), filters.feeMin),
              })
            }
            className="w-full touch-none"
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Stipend range</p>
          <p className="text-xs text-gray-500">
            {formatInr(filters.stipendMin)} – {formatInr(filters.stipendMax)}
          </p>
          <input
            type="range"
            min={bounds.stipendMin}
            max={bounds.stipendMax}
            value={filters.stipendMin}
            onChange={(e) =>
              onFiltersChange({
                stipendMin: Math.min(
                  Number(e.target.value),
                  filters.stipendMax,
                ),
              })
            }
            className="w-full touch-none"
          />
          <input
            type="range"
            min={bounds.stipendMin}
            max={bounds.stipendMax}
            value={filters.stipendMax}
            onChange={(e) =>
              onFiltersChange({
                stipendMax: Math.max(
                  Number(e.target.value),
                  filters.stipendMin,
                ),
              })
            }
            className="w-full touch-none"
          />
        </div>
      </div>

      <Button variant="outline" className="min-h-11 w-full sm:w-auto" onClick={onReset}>
        Reset filters
      </Button>
    </div>
  )
}

export function NeetpgFiltersPanel({
  open,
  onOpenChange,
  showChanceFilter = true,
  bounds,
  filters,
  onToggleRound,
  onToggleChanceLevel,
  onToggleInstitute,
  onToggleCourse,
  onToggleQuota,
  onToggleCategory,
  onFiltersChange,
  onReset,
}: NeetpgFiltersPanelProps) {
  const isMobile = useIsMobile()
  const activeCount = countActiveNeetpgFilters(filters, bounds)

  const contentProps = {
    bounds,
    filters,
    showChanceFilter,
    onToggleRound,
    onToggleChanceLevel,
    onToggleInstitute,
    onToggleCourse,
    onToggleQuota,
    onToggleCategory,
    onFiltersChange,
    onReset,
  }

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="flex min-h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronUp className="h-4 w-4 rotate-180 text-gray-400" />
        </button>

        <ResponsiveModal
          open={open}
          onClose={() => onOpenChange(false)}
          titleId="neetpg-filters-title"
          className="flex max-h-[min(92dvh,900px)] flex-col p-0 pb-safe"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
            <h2
              id="neetpg-filters-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              Filters
              {activeCount > 0 && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({activeCount} active)
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close filters"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <NeetpgFiltersContent {...contentProps} />
          </div>

          <div className="sticky bottom-0 border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <Button
              className="min-h-11 w-full"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </div>
        </ResponsiveModal>
      </>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800">
      <button
        type="button"
        onClick={() => onOpenChange(!open)}
        className="flex min-h-11 w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100"
      >
        <span className="inline-flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {activeCount}
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <NeetpgFiltersContent {...contentProps} />
        </div>
      )}
    </div>
  )
}
