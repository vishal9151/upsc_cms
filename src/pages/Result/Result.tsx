import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  RotateCcw,
  Target,
} from 'lucide-react'
import { BackToExamList } from '@/components/layout/BackToExamList'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  PerformanceSummary,
  ScoreRing,
  StatItem,
} from '@/components/result/PerformanceSummary'
import { QuestionAnalysis } from '@/components/result/QuestionAnalysis'
import { ResultCharts } from '@/components/result/ResultCharts'
import { useExamResult } from '@/hooks/useExamResult'
import { formatTime } from '@/utils/examHelpers'
import { getPaperLabel } from '@/utils/paperData'
import { deleteExamResult } from '@/utils/resultStorage'
import { deleteExam } from '@/utils/examStorage'

export function Result() {
  const data = useExamResult()
  const navigate = useNavigate()
  const location = useLocation()
  const [showRetakeConfirm, setShowRetakeConfirm] = useState(false)

  const autoSubmitted =
    (location.state as { autoSubmitted?: boolean } | null)?.autoSubmitted ??
    data?.summary.autoSubmitted

  if (!data) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No results found for this exam.
        </p>
        <Link to="/">
          <Button variant="outline">
            <Home className="h-4 w-4" />
            Back Home
          </Button>
        </Link>
      </div>
    )
  }

  const { summary, questionResults, year, paper, markedForReview } = data

  const handleRetake = () => {
    deleteExam(year, paper)
    deleteExamResult(year, paper)
    setShowRetakeConfirm(false)
    navigate(`/exam/${year}/${paper}?new=true`)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between gap-3">
        <BackToExamList variant="header" />
      </div>
      <BackToExamList variant="below" />

      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Test Results
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {year} &middot; {getPaperLabel(paper)}
        </p>
        {autoSubmitted && (
          <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
            Time is over. Your test was submitted automatically.
          </p>
        )}
      </div>

      <Card className="text-center">
        <ScoreRing
          scorePercent={summary.scorePercent}
          score={summary.score}
          maxScore={summary.maxScore}
        />
        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          Your Score
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
          <StatItem label="Accuracy" value={`${summary.accuracy}%`} />
          <StatItem label="Attempted" value={summary.attempted} />
          <StatItem
            label="Correct"
            value={summary.correct}
            color="text-green-600 dark:text-green-400"
          />
          <StatItem
            label="Incorrect"
            value={summary.incorrect}
            color="text-red-600 dark:text-red-400"
          />
          <StatItem label="Skipped" value={summary.skipped} />
          <StatItem
            label="Time Taken"
            value={formatTime(summary.timeTakenSeconds)}
          />
        </div>
        <div className="mt-2 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
          <Target className="h-4 w-4" />
          <span className="text-sm">
            Score: {summary.score} / {summary.maxScore} ({summary.scorePercent}%)
          </span>
        </div>
      </Card>

      <PerformanceSummary
        correct={summary.correct}
        incorrect={summary.incorrect}
        skipped={summary.skipped}
        attempted={summary.attempted}
        reviewCount={markedForReview.length}
      />

      <ResultCharts
        correct={summary.correct}
        incorrect={summary.incorrect}
        skipped={summary.skipped}
      />

      <QuestionAnalysis
        questionResults={questionResults}
        onQuestionClick={(index) =>
          navigate(`/review/${year}/${paper}`, { state: { questionIndex: index } })
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to={`/review/${year}/${paper}`}>
          <Button className="w-full sm:w-auto">Review Answers</Button>
        </Link>
        <Button
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={() => setShowRetakeConfirm(true)}
        >
          <RotateCcw className="h-4 w-4" />
          Retake Test
        </Button>
        <Link to="/">
          <Button variant="outline" className="min-h-11 w-full sm:w-auto">
            <Home className="h-4 w-4" />
            Back Home
          </Button>
        </Link>
      </div>

      <ConfirmModal
        open={showRetakeConfirm}
        title="Retake Test?"
        description="This will erase your previous attempt data and start a fresh exam."
        confirmLabel="Retake Test"
        onConfirm={handleRetake}
        onCancel={() => setShowRetakeConfirm(false)}
      />
    </div>
  )
}
