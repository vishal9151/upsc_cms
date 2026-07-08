import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, FileText, Trophy } from 'lucide-react'
import { ResumeModal } from '@/components/exam/ResumeModal'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { formatTime } from '@/utils/examHelpers'
import { formatRelativeTime } from '@/utils/formatRelativeTime'
import { deleteExam, hasSavedExam, loadExam } from '@/utils/examStorage'
import { loadPaperHistory } from '@/utils/resultStorage'
import {
  EXAM_DURATION_MINUTES,
  getPaperLabel,
  getPaperQuestionCount,
} from '@/utils/paperData'

/** Papers shown on the homepage — uncomment entries to enable more. */
const HOME_VISIBLE_PAPERS: { year: string; papers: ('paper1' | 'paper2')[] }[] = [
  { year: '2025', papers: ['paper1','paper2'] },
  { year: '2024', papers: ['paper1'] },
  // { year: '2023', papers: ['paper1', 'paper2'] },
  // { year: '2022', papers: ['paper1', 'paper2'] },
  // { year: '2021', papers: ['paper1', 'paper2'] },
]

interface PaperCardProps {
  year: string
  paper: 'paper1' | 'paper2'
}

function PaperCard({ year, paper }: PaperCardProps) {
  const navigate = useNavigate()
  const [showResume, setShowResume] = useState(false)
  const [showStartAgainConfirm, setShowStartAgainConfirm] = useState(false)
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false)

  const savedExam = loadExam(year, paper)
  const inProgress = hasSavedExam(year, paper) && savedExam !== null
  const history = loadPaperHistory(year, paper)
  const hasCompleted = history !== null && history.attemptCount > 0

  const answeredCount = savedExam
    ? Object.keys(savedExam.answers).length
    : 0
  const questionCount = getPaperQuestionCount(year, paper)
  const totalQuestions = savedExam?.totalQuestions ?? questionCount

  const handleContinue = () => {
    setShowResume(false)
    navigate(`/exam/${year}/${paper}`, { state: { resumeAction: 'continue' } })
  }

  const handleStartAgain = () => {
    deleteExam(year, paper)
    setShowStartAgainConfirm(false)
    setShowResume(false)
    navigate(`/exam/${year}/${paper}?new=true`)
  }

  const handleRetake = () => {
    setShowRetakeConfirm(false)
    navigate(`/exam/${year}/${paper}/instructions`)
  }

  return (
    <div className="h-full">
      <div className="flex h-full flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getPaperLabel(paper)}
            </h3>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                {questionCount} Questions
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {EXAM_DURATION_MINUTES} Minutes
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge variant="blue">{year}</Badge>
            {inProgress && (
              <Badge variant="purple">
                <span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />
                In Progress
              </Badge>
            )}
            {hasCompleted && <Badge variant="green">Completed</Badge>}
          </div>
        </div>

        {hasCompleted && history && (
          <div className="space-y-2 rounded-xl border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/50">
            <div className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-300">
              <Trophy className="h-4 w-4" />
              Performance History
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Best Score</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {history.bestScore} ({history.bestScorePercent}%)
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Latest Score</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {history.latestScore} ({history.latestScorePercent}%)
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Attempts</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {history.attemptCount}
                </p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Last Attempt</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatRelativeTime(history.lastAttemptDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {inProgress && savedExam && (
          <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {answeredCount} / {totalQuestions}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Remaining Time
              </span>
              <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                {formatTime(savedExam.remainingTime)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(savedExam.lastUpdated)}
            </p>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2">
          {inProgress && (
            <>
              <Button className="min-h-11 w-full" onClick={() => setShowResume(true)}>
                Continue
              </Button>
              <Button
                variant="outline"
                className="min-h-11 w-full"
                onClick={() => setShowStartAgainConfirm(true)}
              >
                Start Again
              </Button>
            </>
          )}
          {!inProgress && (
            <Button
              className="min-h-11 w-full"
              onClick={() => navigate(`/exam/${year}/${paper}/instructions`)}
            >
              Attempt
            </Button>
          )}
          {hasCompleted && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                className="min-h-11"
                onClick={() => navigate(`/review/${year}/${paper}`)}
              >
                Review
              </Button>
              <Button
                variant="outline"
                className="min-h-11"
                onClick={() => setShowRetakeConfirm(true)}
              >
                Retake
              </Button>
            </div>
          )}
        </div>
      </div>

      {savedExam && (
        <ResumeModal
          open={showResume}
          savedExam={savedExam}
          onContinue={handleContinue}
          onStartAgain={handleStartAgain}
          onCancel={() => setShowResume(false)}
        />
      )}

      <ConfirmModal
        open={showStartAgainConfirm}
        title="Start New Attempt?"
        description="Your previous progress will be permanently deleted. This action cannot be undone."
        confirmLabel="Start New Attempt"
        onConfirm={handleStartAgain}
        onCancel={() => setShowStartAgainConfirm(false)}
      />

      <ConfirmModal
        open={showRetakeConfirm}
        title="Retake Test?"
        description="This will start a new attempt. Your previous results will remain in history."
        confirmLabel="Retake"
        onConfirm={handleRetake}
        onCancel={() => setShowRetakeConfirm(false)}
      />
    </div>
  )
}

export function Home() {
  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
          UPSC CMS Previous Year Papers
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Practice previous year papers in a real examination environment.
        </p>
      </motion.section>

      <section className="flex flex-col gap-6">
        {HOME_VISIBLE_PAPERS.map((entry, index) => (
          <motion.div
            key={entry.year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Card hoverable className="h-full">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {entry.year}
                </h2>
                <Badge variant="gray">UPSC CMS</Badge>
              </div>
              <div
                className={
                  entry.papers.length > 1
                    ? 'grid grid-cols-1 items-stretch gap-4 md:grid-cols-2'
                    : 'grid grid-cols-1 items-stretch gap-4'
                }
              >
                {entry.papers.map((paper) => (
                  <PaperCard key={paper} year={entry.year} paper={paper} />
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </section>
    </div>
  )
}
