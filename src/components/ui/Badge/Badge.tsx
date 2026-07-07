import { cn } from '@/utils/cn'

type BadgeVariant = 'gray' | 'blue' | 'green' | 'purple' | 'red'

export interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  purple:
    'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
}

export function Badge({
  variant = 'gray',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
