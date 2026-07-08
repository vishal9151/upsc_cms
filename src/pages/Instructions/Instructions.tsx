import { useState } from 'react'
import { AlertCircle, CheckCircle2, Clock, FileText } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { BackToExamList } from '@/components/layout/BackToExamList'
import { ResumeModal } from '@/components/exam/ResumeModal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  EXAM_DURATION_MINUTES,
  getPaperLabel,
  getPaperQuestionCount,
} from '@/utils/paperData'
import { isUnfinishedExam, loadExam } from '@/utils/examStorage'
import { formatInstructionText } from '@/utils/textFormatter'

const navigationInstructions = [
  'Use the question palette on the right to navigate between questions.',
  'Click on a question number to jump directly to that question.',
  'Use Previous and Next buttons to move sequentially.',
  'The timer will start automatically when you begin the test.',
]

const importantInstructions = [
  'Each question carries equal marks with negative marking for wrong answers.',
  'You can mark questions for review and revisit them later.',
  'Your responses are auto-saved throughout the examination.',
  'You can safely close the browser — your progress is saved automatically.',
  'Submit the test before the timer runs out.',
]

export function Instructions() {
  const { year, paper } = useParams<{ year: string; paper: string }>()
  const navigate = useNavigate()
  const [showResume, setShowResume] = useState(false)

  const questionCount =
    year && paper ? getPaperQuestionCount(year, paper) : 0
  const savedExam =
    year && paper ? loadExam(year, paper) : null
  const hasUnfinished = savedExam ? isUnfinishedExam(savedExam) : false

  const handleContinue = () => {
    setShowResume(false)
    navigate(`/exam/${year}/${paper}`, { state: { resumeAction: 'continue' } })
  }

  const handleStartNew = () => {
    if (hasUnfinished) {
      setShowResume(true)
    } else {
      navigate(`/exam/${year}/${paper}?new=true`)
    }
  }

  const handleStartAgain = () => {
    setShowResume(false)
    navigate(`/exam/${year}/${paper}?new=true`)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <BackToExamList variant="header" />
      </div>
      <BackToExamList variant="below" />

      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          Exam Instructions
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {formatInstructionText(
            'Please read all instructions carefully before starting the test.',
          )}
        </p>
      </div>

      <Card>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              UPSC CMS Examination
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {year} &middot; {getPaperLabel(paper ?? '')}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {EXAM_DURATION_MINUTES} Minutes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Questions</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {questionCount}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Auto Save</p>
                <Badge variant="green" className="mt-0.5">
                  Enabled
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Navigation Instructions
            </h3>
            <ul className="space-y-2">
              {navigationInstructions.map((instruction) => (
                <li
                  key={instruction}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />
                  {formatInstructionText(instruction)}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              Important Instructions
            </h3>
            <ul className="space-y-2">
              {importantInstructions.map((instruction) => (
                <li
                  key={instruction}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {formatInstructionText(instruction)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        {hasUnfinished ? (
          <>
            <Button
              size="lg"
              onClick={() => setShowResume(true)}
              className="min-h-11 min-w-[220px]"
            >
              Continue Previous Attempt
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowResume(true)}
              className="min-h-11 min-w-[220px]"
            >
              Start New Attempt
            </Button>
          </>
        ) : (
          <Button size="lg" onClick={handleStartNew} className="min-h-11 min-w-[200px]">
            Start Test
          </Button>
        )}
      </div>

      {savedExam && hasUnfinished && (
        <ResumeModal
          open={showResume}
          savedExam={savedExam}
          onContinue={handleContinue}
          onStartAgain={handleStartAgain}
          onCancel={() => setShowResume(false)}
        />
      )}
    </div>
  )
}
