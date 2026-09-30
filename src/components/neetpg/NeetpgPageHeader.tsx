import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import type { NeetpgDatasetMeta } from '@/types/neetpgCutoff'

interface NeetpgPageHeaderProps {
  meta: NeetpgDatasetMeta
  backTo: string
  backLabel: string
  subtitle?: string
}

export function NeetpgPageHeader({
  meta,
  backTo,
  backLabel,
  subtitle,
}: NeetpgPageHeaderProps) {
  return (
    <>
      <div>
        <Link
          to={backTo}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 text-center sm:text-left"
      >
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          {meta.label}
        </h1>
        <p className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          {subtitle ??
            `${meta.state} NEET-PG counselling · Rounds ${meta.rounds.join(', ')}`}
        </p>
      </motion.div>
    </>
  )
}
