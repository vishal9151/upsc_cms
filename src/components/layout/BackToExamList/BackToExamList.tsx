import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useExamKeyParam } from '@/hooks/useExamKeyParam'
import { getExamListPath } from '@/utils/examRoutes'

interface BackToExamListProps {
  className?: string
  variant?: 'header' | 'below' | 'compact'
}

export function BackToExamList({
  className,
  variant = 'header',
}: BackToExamListProps) {
  const examKey = useExamKeyParam()

  return (
    <Link
      to={getExamListPath(examKey)}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
        variant === 'header' && 'hidden sm:inline-flex',
        variant === 'below' && 'sm:hidden',
        variant === 'compact' && 'min-h-9 shrink-0 px-2 py-1.5 sm:hidden',
        className,
      )}
      aria-label="Back to Exam List"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {variant !== 'compact' && 'Back to Exam List'}
    </Link>
  )
}
