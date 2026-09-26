import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Stethoscope } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { getExams } from '@/utils/paperData'
import { getExamListPath } from '@/utils/examRoutes'
import type { ExamKey } from '@/types/exams'

const EXAM_ICONS: Record<ExamKey, typeof BookOpen> = {
  cms: BookOpen,
  'rajasthan-mo': Stethoscope,
}

export function Home() {
  const exams = getExams()

  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
          Medical Exam Practice
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Choose an exam to practice previous year papers in a real examination
          environment.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mx-auto grid max-w-3xl grid-cols-1 items-stretch gap-4 sm:grid-cols-2"
      >
        {exams.map((exam) => {
          const Icon = EXAM_ICONS[exam.key] ?? BookOpen
          return (
            <Link key={exam.key} to={getExamListPath(exam.key)} className="block h-full">
              <Card hoverable className="flex h-full flex-col items-center gap-4 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {exam.shortLabel}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {exam.description}
                  </p>
                </div>
              </Card>
            </Link>
          )
        })}
      </motion.section>
    </div>
  )
}
