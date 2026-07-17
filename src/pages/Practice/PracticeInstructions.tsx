import { useNavigate, useParams } from 'react-router-dom'
import { BackToExamList } from '@/components/layout/BackToExamList'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CUSTOM_EXAM_YEAR } from '@/types/practice'
import { getSubjectLabel } from '@/types/subject'
import { loadPracticeConfig } from '@/utils/practiceStorage'

export function PracticeInstructions() {
  const { testId } = useParams<{ testId: string }>()
  const navigate = useNavigate()
  const config = testId ? loadPracticeConfig(testId) : null

  if (!config) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Practice test not found.
        </p>
        <Button variant="outline" onClick={() => navigate('/practice')}>
          Create New Test
        </Button>
      </div>
    )
  }

  const handleStart = () => {
    navigate(`/exam/${CUSTOM_EXAM_YEAR}/${config.testId}?new=true`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <BackToExamList variant="header" />
      </div>
      <BackToExamList variant="below" />

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          Ready to Start
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{config.label}</p>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="gray">Untimed</Badge>
            <Badge variant="blue">{config.questions.length} Questions</Badge>
            {config.filters.practiceKind === 'high_yield' ? (
              <Badge variant="green">High Yield Practice</Badge>
            ) : config.filters.practiceKind === 'topic' ? (
              <Badge variant="blue">Subject-level Practice</Badge>
            ) : (
              <Badge variant="purple">Custom Practice</Badge>
            )}
          </div>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong className="text-gray-900 dark:text-gray-100">
                Subjects:
              </strong>{' '}
              {config.filters.subjects
                .map((s) => getSubjectLabel(s))
                .join(', ')}
            </p>
            {config.filters.subTopics && config.filters.subTopics.length > 0 && (
              <p>
                <strong className="text-gray-900 dark:text-gray-100">
                  {config.filters.practiceKind === 'high_yield'
                    ? 'Topics:'
                    : 'Subtopics:'}
                </strong>{' '}
                {config.filters.subTopics.length} selected
              </p>
            )}
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Years:</strong>{' '}
              {config.filters.years.join(', ')}
            </p>
          </div>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Navigate using the question palette or Previous/Next buttons.</li>
            <li>Mark questions for review and revisit them later.</li>
            <li>Your responses are auto-saved throughout the test.</li>
            <li>Submit when you are done — there is no time limit.</li>
          </ul>
        </div>
      </Card>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" onClick={handleStart} className="min-h-11 min-w-[200px]">
          Start Test
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => navigate('/practice')}
          className="min-h-11 min-w-[200px]"
        >
          Back to Builder
        </Button>
      </div>
    </div>
  )
}
