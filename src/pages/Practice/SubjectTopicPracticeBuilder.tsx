import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackToExamList } from '@/components/layout/BackToExamList'
import { QuestionCountStep } from '@/components/practice/QuestionCountStep'
import { PracticeSummaryBar } from '@/components/practice/PracticeSummaryBar'
import { SubjectSelectionStep } from '@/components/practice/SubjectSelectionStep'
import { SubtopicSelectionStep } from '@/components/practice/SubtopicSelectionStep'
import { YearSelectionStep } from '@/components/practice/YearSelectionStep'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useTopicPracticeBuilder } from '@/hooks/useTopicPracticeBuilder'
import { getPracticeInstructionsPath } from '@/utils/examRoutes'
import { generatePracticeTest } from '@/utils/practiceGenerator'

export function SubjectTopicPracticeBuilder() {
  const navigate = useNavigate()
  const [generating, setGenerating] = useState(false)
  const builder = useTopicPracticeBuilder()

  const steps = builder.supportsSubTopics
    ? (['Subjects', 'Subtopics', 'Years', 'Count'] as const)
    : (['Subjects', 'Years', 'Count'] as const)

  const handleGenerate = () => {
    if (!builder.canGenerate) return
    setGenerating(true)
    const config = generatePracticeTest({
      ...builder.filters,
      questionCount: builder.effectiveCount,
    })
    setGenerating(false)
    if (!config) return
    navigate(getPracticeInstructionsPath(config.testId))
  }

  const canProceed =
    builder.step === 0
      ? builder.canProceedStep0
      : builder.step === 1
        ? builder.canProceedStep1
        : builder.step === 2
          ? builder.canProceedStep2
          : false

  const showSubjects = builder.step === 0
  const showSubtopics = builder.supportsSubTopics && builder.step === 1
  const showYears = builder.supportsSubTopics
    ? builder.step === 2
    : builder.step === 1
  const showCount = builder.supportsSubTopics
    ? builder.step === 3
    : builder.step === 2

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24 sm:pb-8">
      <div className="flex items-center justify-between gap-3">
        <BackToExamList variant="header" />
      </div>
      <BackToExamList variant="below" />

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          Subject-level Practice
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {builder.supportsSubTopics
            ? 'Narrow your practice test by subject subtopics from the syllabus.'
            : 'Build a practice test by subject from this exam’s previous papers.'}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {steps.map((label, index) => (
          <span
            key={label}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              builder.step === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            {index + 1}. {label}
          </span>
        ))}
      </div>

      <Card>
        <div className="space-y-6">
          {showSubjects && (
            <SubjectSelectionStep
              selected={builder.subjects}
              onToggle={builder.toggleSubject}
            />
          )}
          {showSubtopics && (
            <SubtopicSelectionStep
              topicGroups={builder.topicGroups}
              selected={builder.subTopics}
              matchingCount={builder.matchingCount}
              onToggle={builder.toggleSubTopic}
              onSelectAll={builder.selectAllSubTopics}
              onClearAll={builder.clearAllSubTopics}
            />
          )}
          {showYears && (
            <YearSelectionStep
              years={builder.availableYears}
              selected={builder.years}
              matchingCount={builder.matchingCount}
              onToggle={builder.toggleYear}
            />
          )}
          {showCount && (
            <>
              <QuestionCountStep
                questionCount={builder.questionCount}
                matchingCount={builder.matchingCount}
                effectiveCount={builder.effectiveCount}
                onChange={builder.setQuestionCount}
              />
              <PracticeSummaryBar
                filters={builder.filters}
                matchingCount={builder.matchingCount}
              />
            </>
          )}
        </div>
      </Card>

      <div className="sticky bottom-0 z-20 -mx-4 flex gap-3 border-t border-gray-200 bg-white/95 p-4 pb-sticky-bar-safe backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:pb-0 sm:backdrop-blur-none">
        {builder.step > 0 && (
          <Button
            variant="outline"
            className="min-h-11 flex-1 sm:flex-none"
            onClick={builder.goBack}
          >
            Back
          </Button>
        )}
        {builder.step < builder.lastStep ? (
          <Button
            className="min-h-11 flex-1 sm:ml-auto sm:flex-none"
            disabled={!canProceed}
            onClick={builder.goNext}
          >
            Next
          </Button>
        ) : (
          <Button
            className="min-h-11 flex-1 sm:ml-auto sm:flex-none"
            disabled={!builder.canGenerate || generating}
            onClick={handleGenerate}
          >
            {generating ? 'Generating...' : 'Generate Test'}
          </Button>
        )}
      </div>
    </div>
  )
}
