import { cn } from '@/utils/cn'

interface PracticeFilterChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

export function PracticeFilterChip({
  label,
  selected,
  onClick,
}: PracticeFilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'min-h-11 rounded-xl border px-4 py-2 text-sm font-medium transition-colors',
        selected
          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-300'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600',
      )}
    >
      {label}
    </button>
  )
}
