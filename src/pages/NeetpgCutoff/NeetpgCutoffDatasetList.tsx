import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  getNeetpgDatasets,
  getNeetpgToolMeta,
} from '@/utils/neetpgCutoffData'

export function NeetpgCutoffDatasetList() {
  const { label: toolLabel } = getNeetpgToolMeta()
  const datasets = getNeetpgDatasets()

  return (
    <div className="space-y-12">
      <div>
        <Link
          to="/"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All Exams
        </Link>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
          {toolLabel}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Choose a counselling dataset to look up seat cutoffs and chances by
          rank.
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mx-auto grid max-w-2xl grid-cols-1 gap-4"
      >
        {datasets.map((dataset) => (
          <Link
            key={dataset.id}
            to={`/neetpg-cutoff/${dataset.id}`}
            className="block h-full"
          >
            <Card hoverable className="h-full p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {dataset.label}
                  </h2>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {dataset.state} · {dataset.year}
                  </p>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {dataset.totalRecords.toLocaleString()} branches ·{' '}
                    {dataset.totalInstitutes} institutes
                  </p>
                </div>
                <Badge variant="blue">{dataset.year}</Badge>
              </div>
            </Card>
          </Link>
        ))}
      </motion.section>
    </div>
  )
}
