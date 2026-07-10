import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, Play, RotateCcw } from 'lucide-react'
import { ResumeModal } from '@/components/exam/ResumeModal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { CUSTOM_EXAM_YEAR } from '@/types/practice'
import { deleteExam, hasSavedExam, loadExam } from '@/utils/examStorage'
import { formatRelativeTime } from '@/utils/formatRelativeTime'
import { loadPaperHistory } from '@/utils/resultStorage'
import {
  getPracticeIndex,
  loadPracticeConfig,
} from '@/utils/practiceStorage'

function getInProgressPractice() {
  const entries = getPracticeIndex()
  for (const entry of entries) {
    if (hasSavedExam(CUSTOM_EXAM_YEAR, entry.testId)) {
      const saved = loadExam(CUSTOM_EXAM_YEAR, entry.testId)
      const config = loadPracticeConfig(entry.testId)
      if (saved && config) {
        return { entry, saved, config }
      }
    }
  }
  return null
}

export function CustomPracticeCard() {
  const navigate = useNavigate()
  const [showResume, setShowResume] = useState(false)
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false)
  const [retakeTestId, setRetakeTestId] = useState<string | null>(null)

  const inProgress = getInProgressPractice()
  const recentEntries = getPracticeIndex().slice(0, 3)

  const handleContinue = () => {
    if (!inProgress) return
    setShowResume(false)
    navigate(`/exam/${CUSTOM_EXAM_YEAR}/${inProgress.entry.testId}`, {
      state: { resumeAction: 'continue' },
    })
  }

  const handleStartAgain = () => {
    if (!inProgress) return
    deleteExam(CUSTOM_EXAM_YEAR, inProgress.entry.testId)
    setShowResume(false)
    navigate(`/exam/${CUSTOM_EXAM_YEAR}/${inProgress.entry.testId}?new=true`)
  }

  const handleRetake = () => {
    if (!retakeTestId) return
    const config = loadPracticeConfig(retakeTestId)
    setShowRetakeConfirm(false)
    if (config) {
      navigate(`/practice/${retakeTestId}/instructions`)
    }
  }

  return (
    <>
      <Card hoverable className="h-full">
        <div className="flex h-full flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Custom Practice Test
                </h2>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Build an untimed test by subject and year from previous papers.
              </p>
            </div>
            <Badge variant="purple">New</Badge>
          </div>

          {inProgress && (
            <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/50">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                In Progress: {inProgress.config.label}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Object.keys(inProgress.saved.answers).length} /{' '}
                {inProgress.saved.totalQuestions} answered ·{' '}
                {formatRelativeTime(inProgress.saved.lastUpdated)}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  size="sm"
                  className="min-h-11"
                  onClick={() => setShowResume(true)}
                >
                  Continue
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="min-h-11"
                  onClick={handleStartAgain}
                >
                  Start Again
                </Button>
              </div>
            </div>
          )}

          {recentEntries.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Recent Tests
              </p>
              {recentEntries.map((entry) => {
                const history = loadPaperHistory(CUSTOM_EXAM_YEAR, entry.testId)
                return (
                  <div
                    key={entry.testId}
                    className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                        {entry.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.questionCount} questions
                        {history
                          ? ` · Best ${history.bestScore} (${history.bestScorePercent}%)`
                          : ''}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {history && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            navigate(
                              `/result/${CUSTOM_EXAM_YEAR}/${entry.testId}`,
                            )
                          }
                        >
                          View
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRetakeTestId(entry.testId)
                          setShowRetakeConfirm(true)
                        }}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-auto">
            <Button
              className="min-h-11 w-full"
              onClick={() => navigate('/practice')}
            >
              <Play className="h-4 w-4" />
              Create Practice Test
            </Button>
          </div>
        </div>
      </Card>

      {inProgress && (
        <ResumeModal
          open={showResume}
          savedExam={inProgress.saved}
          isTimed={false}
          onContinue={handleContinue}
          onStartAgain={handleStartAgain}
          onCancel={() => setShowResume(false)}
        />
      )}

      <ConfirmModal
        open={showRetakeConfirm}
        title="Retake Practice Test?"
        description="Start a new attempt with the same question set."
        confirmLabel="Retake"
        onConfirm={handleRetake}
        onCancel={() => setShowRetakeConfirm(false)}
      />
    </>
  )
}
