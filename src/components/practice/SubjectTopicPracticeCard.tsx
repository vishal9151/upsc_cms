import { useNavigate } from 'react-router-dom'
import { BookOpen, Play } from 'lucide-react'
import { PracticeCardActivity } from '@/components/practice/PracticeCardActivity'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function SubjectTopicPracticeCard() {
  const navigate = useNavigate()

  return (
    <Card hoverable className="h-full">
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Subject-level Practice
              </h2>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Choose subjects, then fine-tune by subtopics before picking years
              and question count.
            </p>
          </div>
          <Badge variant="blue">Topics</Badge>
        </div>

        <PracticeCardActivity kind="topic" />

        <div className="mt-auto">
          <Button
            className="min-h-11 w-full"
            onClick={() => navigate('/practice/topics')}
          >
            <Play className="h-4 w-4" />
            Create Topic Practice
          </Button>
        </div>
      </div>
    </Card>
  )
}
