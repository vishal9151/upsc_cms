import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function formatRelativeTime(isoDate: string): string {
  const date = dayjs(isoDate)
  if (!date.isValid()) return 'Unknown'

  const now = dayjs()
  const diffDays = now.diff(date, 'day')

  if (diffDays >= 1) {
    return date.format('MMMM D, YYYY')
  }

  return `Saved ${date.fromNow()}`
}
