import { Link } from 'react-router-dom'
import { BarChart3 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface BackToResultsProps {
  year: string
  paper: string
  className?: string
  variant?: 'header' | 'below'
}

export function BackToResults({
  year,
  paper,
  className,
  variant = 'header',
}: BackToResultsProps) {
  return (
    <Link
      to={`/result/${year}/${paper}`}
      className={cn(
        'inline-flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
        variant === 'header' && 'hidden sm:inline-flex',
        variant === 'below' && 'sm:hidden',
        className,
      )}
      aria-label="Back to Results"
    >
      <BarChart3 className="h-4 w-4" aria-hidden="true" />
      Back to Results
    </Link>
  )
}
