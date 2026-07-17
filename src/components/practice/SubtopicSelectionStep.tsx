import { getSubjectLabel } from '@/types/subject'
import type { SubjectTopicGroup } from '@/types/syllabus'
import { PracticeFilterChip } from '@/components/practice/PracticeFilterChip'
import { Button } from '@/components/ui/Button'

interface SubtopicSelectionStepProps {
  topicGroups: SubjectTopicGroup[]
  selected: string[]
  matchingCount: number
  onToggle: (topic: string) => void
  onSelectAll: () => void
  onClearAll: () => void
}

export function SubtopicSelectionStep({
  topicGroups,
  selected,
  matchingCount,
  onToggle,
  onSelectAll,
  onClearAll,
}: SubtopicSelectionStepProps) {
  const allTopics = topicGroups.flatMap((group) => group.topics)
  const allSelected =
    allTopics.length > 0 && allTopics.every((topic) => selected.includes(topic))

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Select Subtopics
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          All subtopics are selected by default. Deselect any you want to
          exclude. Only tagged questions are included.
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
              {group.topics.map((topic) => (
                <PracticeFilterChip
                  key={`${group.subject}-${topic}`}
                  label={topic}
                  selected={selected.includes(topic)}
                  onClick={() => onToggle(topic)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
