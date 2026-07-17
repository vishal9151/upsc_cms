import { useNavigate } from 'react-router-dom'
import { Flame, Play } from 'lucide-react'
import { PracticeCardActivity } from '@/components/practice/PracticeCardActivity'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function HighYieldPracticeCard() {
  const navigate = useNavigate()

  return (
    <Card hoverable className="h-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                High Yield Practice
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Drill the most exam-relevant topics — ordered by importance, with
              high-yield topics selected by default.
            </p>
          </div>
          <Badge variant="green">High Yield</Badge>
        </div>

        <PracticeCardActivity kind="high_yield" />

        <div className="mt-auto">
          <Button
            className="min-h-11 w-full"
            onClick={() => navigate('/practice/high-yield')}
          >
            <Play className="h-4 w-4" />
            Create High Yield Test
          </Button>
        </div>
      </div>
    </Card>
  )
}
