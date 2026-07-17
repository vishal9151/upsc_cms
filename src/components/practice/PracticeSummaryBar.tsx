import { getSubjectLabel } from '@/types/subject'
import type { PracticeFilters } from '@/types/practice'

interface PracticeSummaryBarProps {
  filters: PracticeFilters
  matchingCount: number
}

export function PracticeSummaryBar({
  filters,
  matchingCount,
}: PracticeSummaryBarProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        Summary
      </p>
      <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
        <li>
          Subjects:{' '}
          {filters.subjects.length > 0
            ? filters.subjects.map((s) => getSubjectLabel(s)).join(', ')
            : 'None'}
        </li>
        {filters.subTopics && (
          <li>
            Subtopics: {filters.subTopics.length} selected
          </li>
        )}
        <li>Years: {filters.years.join(', ') || 'None'}</li>
        <li>Available: {matchingCount} questions</li>
        <li>Test size: {Math.min(filters.questionCount, matchingCount)}</li>
        <li>Mode: Untimed practice</li>
      </ul>
    </div>
  )
}
