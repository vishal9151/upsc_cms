import { Badge } from '@/components/ui/Badge'
import type { ChanceLevel } from '@/types/neetpgCutoff'
import { CHANCE_LABELS } from '@/utils/neetpgChances'

const VARIANT: Record<
  ChanceLevel,
  'green' | 'amber' | 'orange' | 'gray'
> = {
  high: 'green',
  moderate: 'amber',
  low: 'orange',
  veryLow: 'gray',
}

interface ChanceTagProps {
  level: ChanceLevel
  className?: string
}

export function ChanceTag({ level, className }: ChanceTagProps) {
  return (
    <Badge
      variant={VARIANT[level]}
      className={className}
    >
      {CHANCE_LABELS[level]}
    </Badge>
  )
}
