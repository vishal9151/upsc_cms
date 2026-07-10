import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackToExamList } from '@/components/layout/BackToExamList'
import { QuestionCountStep } from '@/components/practice/QuestionCountStep'
import { PracticeSummaryBar } from '@/components/practice/PracticeSummaryBar'
import { SubjectSelectionStep } from '@/components/practice/SubjectSelectionStep'
import { YearSelectionStep } from '@/components/practice/YearSelectionStep'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { usePracticeBuilder } from '@/hooks/usePracticeBuilder'
import { generatePracticeTest } from '@/utils/practiceGenerator'

const STEPS = ['Subjects', 'Years', 'Count'] as const

export function PracticeBuilder() {
  const navigate = useNavigate()
  const [generating, setGenerating] = useState(false)
  const builder = usePracticeBuilder()

  const handleGenerate = () => {
    if (!builder.canGenerate) return
    setGenerating(true)
    const config = generatePracticeTest({
      ...builder.filters,
      questionCount: builder.effectiveCount,
    })
    setGenerating(false)
    if (!config) return
    navigate(`/practice/${config.testId}/instructions`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24 sm:pb-8">
      <div className="flex items-center justify-between gap-3">
        <BackToExamList variant="header" />
      </div>
      <BackToExamList variant="below" />

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          Custom Practice Test
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Build a personalized untimed test from previous year questions.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {STEPS.map((label, index) => (
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
          {builder.step === 0 && (
            <SubjectSelectionStep
              selected={builder.subjects}
              onToggle={builder.toggleSubject}
            />
          )}
          {builder.step === 1 && (
            <YearSelectionStep
              years={builder.availableYears}
              selected={builder.years}
              matchingCount={builder.matchingCount}
              onToggle={builder.toggleYear}
            />
          )}
          {builder.step === 2 && (
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

      <div className="sticky bottom-0 z-20 -mx-4 flex gap-3 border-t border-gray-200 bg-white/95 p-4 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95 sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        {builder.step > 0 && (
          <Button
            variant="outline"
            className="min-h-11 flex-1 sm:flex-none"
            onClick={builder.goBack}
          >
            Back
          </Button>
        )}
        {builder.step < 2 ? (
          <Button
            className="min-h-11 flex-1 sm:ml-auto sm:flex-none"
            disabled={
              builder.step === 0
                ? !builder.canProceedStep0
                : !builder.canProceedStep1
            }
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
