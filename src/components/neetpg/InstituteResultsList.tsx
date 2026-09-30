import { ChevronDown, Info } from 'lucide-react'
import type { ChanceLevel, CutoffRecord } from '@/types/neetpgCutoff'
import {
  CHANCE_LABELS,
  CHANCE_LEVELS_DESC,
  CHANCE_LOGIC_TOOLTIP,
} from '@/utils/neetpgChances'
import { BranchRow } from '@/components/neetpg/BranchRow'
import { ChanceTag } from '@/components/neetpg/ChanceTag'

interface InstituteGroupWithChance {
  institute: string
  branchChances: { branch: CutoffRecord; chance: ChanceLevel }[]
  bestChance: ChanceLevel | null
}

interface InstituteResultsListProps {
  groups: InstituteGroupWithChance[]
  source: string
  disclaimer: string
  matchCount: number
}

function InstituteCard({ group }: { group: InstituteGroupWithChance }) {
  return (
    <details className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <summary className="flex cursor-pointer list-none items-start gap-3 bg-white px-3 py-3.5 dark:bg-gray-900 sm:px-4 sm:py-4 [&::-webkit-details-marker]:hidden">
        <ChevronDown
          className="mt-0.5 h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100 sm:text-base">
          {group.institute}
        </span>
        {group.bestChance && (
          <ChanceTag
            level={group.bestChance}
            className="mt-0.5 shrink-0 whitespace-nowrap"
          />
        )}
      </summary>

      <div className="border-t border-indigo-100 bg-indigo-50/70 dark:border-indigo-950 dark:bg-indigo-950/25">
        <div className="border-b border-indigo-100/80 px-3 py-2 dark:border-indigo-900/50 sm:px-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-800/80 dark:text-indigo-300/90">
            Courses at this college
          </p>
          <p className="mt-0.5 text-xs text-indigo-700/70 dark:text-indigo-400/80">
            {group.branchChances.length} branch
            {group.branchChances.length === 1 ? '' : 'es'}
          </p>
        </div>
        <div className="space-y-3 p-3 sm:p-4">
          {group.branchChances.map(({ branch, chance }) => (
            <BranchRow key={branch.id} record={branch} chance={chance} />
          ))}
        </div>
      </div>
    </details>
  )
}

export function InstituteResultsList({
  groups,
  source,
  disclaimer,
  matchCount,
}: InstituteResultsListProps) {
  const sections = CHANCE_LEVELS_DESC.map((level) => ({
    level,
    label: CHANCE_LABELS[level],
    groups: groups.filter((g) => g.bestChance === level),
  })).filter((section) => section.groups.length > 0)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40">
        <p className="font-medium text-amber-900 dark:text-amber-200">
          {source}
        </p>
        <p className="mt-2 text-amber-800/90 dark:text-amber-100/80">
          {disclaimer}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {matchCount} branch{matchCount === 1 ? '' : 'es'} ·{' '}
          {groups.length} institute{groups.length === 1 ? '' : 's'} · sorted
          by chance
        </p>
        <span
          className="inline-flex items-center gap-1 text-xs text-gray-500"
          title={CHANCE_LOGIC_TOOLTIP}
        >
          <Info className="h-3.5 w-3.5" aria-hidden="true" />
          Chance logic
        </span>
      </div>

      {groups.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-gray-500 dark:border-gray-800">
          No branches match your filters.
        </p>
      ) : (
        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.level} className="space-y-3">
              <div className="sticky top-16 z-10 -mx-1 flex items-center gap-2 bg-white/95 py-2 backdrop-blur-sm dark:bg-gray-950/95">
                <ChanceTag
                  level={section.level}
                  className="shrink-0 whitespace-nowrap"
                />
                <span className="text-sm text-gray-500">
                  {section.groups.length} college
                  {section.groups.length === 1 ? '' : 's'}
                </span>
              </div>
              <ul className="space-y-3">
                {section.groups.map((group) => (
                  <li key={group.institute}>
                    <InstituteCard group={group} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
