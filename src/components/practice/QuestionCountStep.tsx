interface QuestionCountStepProps {
  questionCount: number
  matchingCount: number
  effectiveCount: number
  onChange: (count: number) => void
}

export function QuestionCountStep({
  questionCount,
  matchingCount,
  effectiveCount,
  onChange,
}: QuestionCountStepProps) {
  const max = Math.max(matchingCount, 1)

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Choose Question Count
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Select how many questions to include (max {matchingCount} available).
        </p>
      </div>

      <div className="space-y-3">
        <input
          type="range"
          min={1}
          max={max}
          value={Math.min(questionCount, max)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={max}
            value={Math.min(questionCount, max)}
            onChange={(e) => {
              const val = Number(e.target.value)
              if (!Number.isNaN(val)) onChange(val)
            }}
            className="w-24 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            of {matchingCount} available
          </span>
        </div>
      </div>

      <p className="rounded-xl bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950 dark:text-blue-300">
        Your test will have <strong>{effectiveCount}</strong> questions, randomly
        sampled from the matching pool.
      </p>
    </div>
  )
}
