import { getSubjectLabel } from '@/types/subject'
import type { SubjectTopicGroup } from '@/types/syllabus'
import { isHighYieldTopic } from '@/types/highYield'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/utils/cn'

interface HighYieldSubtopicSelectionStepProps {
  topicGroups: SubjectTopicGroup[]
  selected: string[]
  matchingCount: number
  onToggle: (topic: string) => void
  onSelectHighYield: () => void
  onSelectAll: () => void
  onClearAll: () => void
}

export function HighYieldSubtopicSelectionStep({
  topicGroups,
  selected,
  matchingCount,
  onToggle,
  onSelectHighYield,
  onSelectAll,
  onClearAll,
}: HighYieldSubtopicSelectionStepProps) {
  const allTopics = topicGroups.flatMap((group) => group.topics)
  const allSelected =
    allTopics.length > 0 && allTopics.every((topic) => selected.includes(topic))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Select Topics
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Topics are ordered by exam importance. Top high-yield topics are
          selected by default — add more from the list if you want.
        </p>
        <p className="mt-2 text-sm font-medium text-blue-700 dark:text-blue-300">
          {matchingCount} questions match your current selection
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="min-h-9"
          onClick={onSelectHighYield}
        >
          Select high yield
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="min-h-9"
          disabled={allSelected}
          onClick={onSelectAll}
        >
          Select all
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="min-h-9"
          disabled={selected.length === 0}
          onClick={onClearAll}
        >
          Clear all
        </Button>
      </div>

      <div className="space-y-6">
        {topicGroups.map((group) => (
          <div key={group.subject} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {getSubjectLabel(group.subject)}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.topics.map((topic) => {
                const isSelected = selected.includes(topic)
                const highYield = isHighYieldTopic(group.subject, topic)

                return (
                  <button
                    key={`${group.subject}-${topic}`}
                    type="button"
                    onClick={() => onToggle(topic)}
                    aria-pressed={isSelected}
                    className={cn(
                      'inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors',
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-300'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600',
                    )}
                  >
                    <span>{topic}</span>
                    {highYield && (
                      <Badge variant="green" className="text-[10px]">
                        High yield
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
