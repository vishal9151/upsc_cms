import { useNavigate } from 'react-router-dom'
import { Layers, Play } from 'lucide-react'
import { PracticeCardActivity } from '@/components/practice/PracticeCardActivity'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useExamKeyParam } from '@/hooks/useExamKeyParam'
import { getPracticePath } from '@/utils/examRoutes'

export function CustomPracticeCard() {
  const navigate = useNavigate()
  const examKey = useExamKeyParam()

  return (
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

        <PracticeCardActivity kind="custom" />

        <div className="mt-auto">
          <Button
            className="min-h-11 w-full"
            onClick={() => navigate(getPracticePath(examKey, 'custom'))}
          >
            <Play className="h-4 w-4" />
            Create Practice Test
          </Button>
        </div>
      </div>
    </Card>
  )
}
