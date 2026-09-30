import type { ChanceLevel, CutoffRecord } from '@/types/neetpgCutoff'
import { ChanceTag } from '@/components/neetpg/ChanceTag'

function formatInr(value: number | null): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

interface BranchRowProps {
  record: CutoffRecord
  chance: ChanceLevel
}

export function BranchRow({ record, chance }: BranchRowProps) {
  return (
    <div className="space-y-3 rounded-lg border border-white/80 bg-white p-3 shadow-sm ring-1 ring-gray-200/60 dark:border-gray-800 dark:bg-gray-900 dark:ring-gray-700/60 sm:p-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug text-gray-900 dark:text-gray-100">
            {record.course}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm dark:text-gray-400">
            {record.quota} · {record.category}
          </p>
        </div>
        <ChanceTag level={chance} className="shrink-0 whitespace-nowrap" />
      </div>

      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-gray-500">Fee</dt>
          <dd className="font-medium">{formatInr(record.fee)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Stipend</dt>
          <dd className="font-medium">{formatInr(record.stipend)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Bond</dt>
          <dd className="font-medium">
            {record.bondYears != null ? `${record.bondYears} yr` : '—'}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500">Penalty</dt>
          <dd className="font-medium">{formatInr(record.bondPenalty)}</dd>
        </div>
      </dl>

      <div className="overflow-x-auto rounded-md bg-gray-50/90 dark:bg-gray-950/50">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-gray-500">
              <th className="px-2 pb-2 pt-1 font-medium">Round</th>
              <th className="px-2 pb-2 pt-1 font-medium">Closing state rank</th>
              <th className="px-2 pb-2 pt-1 font-medium">Closing AIR</th>
            </tr>
          </thead>
          <tbody>
            {record.rounds.map((round) => (
              <tr
                key={round.round}
                className="border-t border-gray-200/80 dark:border-gray-800"
              >
                <td className="px-2 py-2 font-medium">{round.round}</td>
                <td className="px-2 py-2">{round.closingStateRank}</td>
                <td className="px-2 py-2 text-gray-500">{round.closingAir}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-700 sm:text-sm dark:text-gray-300">
        Final range (state):{' '}
        <span className="font-semibold">
          {record.overall.openingStateRank} – {record.overall.closingStateRank}
        </span>
        <span className="mt-1 block text-xs text-gray-500 sm:mt-0 sm:inline sm:ml-2">
          AIR {record.overall.openingAir} – {record.overall.closingAir}
        </span>
      </p>
    </div>
  )
}
