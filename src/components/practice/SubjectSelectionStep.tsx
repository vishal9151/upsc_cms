import { SUBJECTS } from '@/types/subject'
import type { SubjectKey } from '@/types/subject'
import { PracticeFilterChip } from '@/components/practice/PracticeFilterChip'

interface SubjectSelectionStepProps {
  selected: SubjectKey[]
  onToggle: (key: SubjectKey) => void
}

export function SubjectSelectionStep({
  selected,
  onToggle,
}: SubjectSelectionStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Select Subjects
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose one or more subjects to include in your practice test.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map((subject) => (
          <PracticeFilterChip
            key={subject.key}
            label={subject.label}
            selected={selected.includes(subject.key)}
            onClick={() => onToggle(subject.key)}
          />
        ))}
      </div>
    </div>
  )
}
