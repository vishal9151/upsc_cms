import { useMemo, useState } from 'react'
import { PracticeFilterChip } from '@/components/practice/PracticeFilterChip'

interface SearchableMultiSelectProps {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  maxHeightClass?: string
}

export function SearchableMultiSelect({
  label,
  options,
  selected,
  onToggle,
  maxHeightClass = 'max-h-40',
}: SearchableMultiSelectProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => o.toLowerCase().includes(q))
  }, [options, query])

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
      </p>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((value) => (
            <PracticeFilterChip
              key={value}
              label={value.length > 40 ? `${value.slice(0, 40)}…` : value}
              selected
              onClick={() => onToggle(value)}
            />
          ))}
        </div>
      )}
      <input
        type="search"
        placeholder={`Search ${label.toLowerCase()}…`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="min-h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
      />
      <div
        className={`overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800 ${maxHeightClass}`}
      >
        {filtered.length === 0 ? (
          <p className="p-3 text-sm text-gray-500">No matches</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((option) => {
              const isSelected = selected.includes(option)
              return (
                <li key={option}>
                  <label className="flex min-h-10 cursor-pointer items-start gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-900">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(option)}
                      className="mt-0.5"
                    />
                    <span className="text-gray-800 dark:text-gray-200">
                      {option}
                    </span>
                  </label>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
