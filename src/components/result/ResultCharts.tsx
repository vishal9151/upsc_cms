import { memo, useMemo } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '@/components/ui/Card'

interface ResultChartsProps {
  correct: number
  incorrect: number
  skipped: number
}

const COLORS = {
  correct: '#22c55e',
  incorrect: '#ef4444',
  skipped: '#9ca3af',
}

export const ResultCharts = memo(function ResultCharts({
  correct,
  incorrect,
  skipped,
}: ResultChartsProps) {
  const pieData = useMemo(
    () => [
      { name: 'Correct', value: correct, color: COLORS.correct },
      { name: 'Incorrect', value: incorrect, color: COLORS.incorrect },
      { name: 'Skipped', value: skipped, color: COLORS.skipped },
    ],
    [correct, incorrect, skipped],
  )

  const barData = useMemo(
    () => [
      { name: 'Correct', count: correct, fill: COLORS.correct },
      { name: 'Incorrect', count: incorrect, fill: COLORS.incorrect },
    ],
    [correct, incorrect],
  )

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
          Answer Distribution
        </h3>
        <div
          className="h-64"
          role="img"
          aria-label={`Pie chart: ${correct} correct, ${incorrect} incorrect, ${skipped} skipped`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex justify-center gap-4 text-xs">
          {pieData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.name}: {item.value}
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">
          Correct vs Incorrect
        </h3>
        <div
          className="h-64"
          role="img"
          aria-label={`Bar chart: ${correct} correct, ${incorrect} incorrect`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {barData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
})
