import type { RankMode } from '@/types/neetpgCutoff'
import { cn } from '@/utils/cn'

interface RankInputSectionProps {
  userRankInput: string
  onUserRankInputChange: (value: string) => void
  rankMode: RankMode
  onRankModeChange: (mode: RankMode) => void
}

export function RankInputSection({
  userRankInput,
  onUserRankInputChange,
  rankMode,
  onRankModeChange,
}: RankInputSectionProps) {
  return (
    <div className="space-y-3 rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-blue-950/30 sm:space-y-4 sm:p-5">
      <div>
        <label
          htmlFor="neetpg-rank"
          className="text-sm font-semibold text-gray-900 dark:text-gray-100"
        >
          Your Rank <span className="text-red-500">*</span>
        </label>
        <p className="mt-1 hidden text-xs text-gray-500 dark:text-gray-400 sm:block">
          Enter your rank to see college-wise chances. Results appear after you
          enter a valid rank.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <input
          id="neetpg-rank"
          type="number"
          min={1}
          inputMode="numeric"
          placeholder="e.g. 500"
          value={userRankInput}
          onChange={(e) => onUserRankInputChange(e.target.value)}
          className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-lg font-semibold text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 sm:max-w-xs"
        />
        <div className="flex rounded-xl border border-gray-200 p-1 dark:border-gray-700">
          {(['state', 'air'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onRankModeChange(mode)}
              className={cn(
                'min-h-10 flex-1 rounded-lg px-4 text-sm font-medium transition-colors sm:flex-none',
                rankMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
              )}
            >
              {mode === 'state' ? 'State Rank' : 'AIR'}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        All-India quota seats are matched by AIR automatically.
      </p>
    </div>
  )
}
