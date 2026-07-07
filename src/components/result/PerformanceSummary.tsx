import { memo } from 'react'
import { Card } from '@/components/ui/Card'

interface ScoreRingProps {
  scorePercent: number
  score: number
  maxScore: number
}

export const ScoreRing = memo(function ScoreRing({
  scorePercent,
  score,
  maxScore,
}: ScoreRingProps) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (scorePercent / 100) * circumference

  return (
    <div className="relative mx-auto h-36 w-36" role="img" aria-label={`Score ${score} out of ${maxScore}, ${scorePercent} percent`}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          className="text-gray-200 dark:text-gray-800"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-blue-600 transition-all duration-700 dark:text-blue-400"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {score}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          / {maxScore}
        </span>
      </div>
    </div>
  )
})

interface StatItemProps {
  label: string
  value: string | number
  color?: string
}

export const StatItem = memo(function StatItem({
  label,
  value,
  color = 'text-gray-900 dark:text-gray-100',
}: StatItemProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  )
})

interface PerformanceSummaryProps {
  correct: number
  incorrect: number
  skipped: number
  attempted: number
  reviewCount: number
}

export const PerformanceSummary = memo(function PerformanceSummary({
  correct,
  incorrect,
  skipped,
  attempted,
  reviewCount,
}: PerformanceSummaryProps) {
  const items = [
    { label: 'Correct', value: correct, color: 'text-green-600 dark:text-green-400' },
    { label: 'Incorrect', value: incorrect, color: 'text-red-600 dark:text-red-400' },
    { label: 'Skipped', value: skipped, color: 'text-gray-600 dark:text-gray-400' },
    { label: 'Answered', value: attempted, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Review', value: reviewCount, color: 'text-purple-600 dark:text-purple-400' },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
      {items.map((item) => (
        <Card key={item.label} className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
          <p className={`mt-1 text-2xl font-bold ${item.color}`}>{item.value}</p>
        </Card>
      ))}
    </div>
  )
})
