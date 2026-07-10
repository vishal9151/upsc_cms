import { PracticeFilterChip } from '@/components/practice/PracticeFilterChip'

interface YearSelectionStepProps {
  years: string[]
  selected: string[]
  matchingCount: number
  onToggle: (year: string) => void
}

export function YearSelectionStep({
  years,
  selected,
  matchingCount,
  onToggle,
}: YearSelectionStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Select Years
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Pick which previous year papers to pull questions from.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {years.map((year) => (
          <PracticeFilterChip
            key={year}
            label={year}
            selected={selected.includes(year)}
            onClick={() => onToggle(year)}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {matchingCount} questions match your filters
      </p>
    </div>
  )
}
