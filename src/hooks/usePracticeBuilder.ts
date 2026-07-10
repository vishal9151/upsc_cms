import { useMemo, useState } from 'react'
import type { PracticeFilters } from '@/types/practice'
import type { SubjectKey } from '@/types/subject'
import { countMatchingQuestions } from '@/utils/questionPool'
import { EXAM_YEARS } from '@/utils/paperData'

const DEFAULT_YEARS = [...EXAM_YEARS].filter((y) =>
  ['2025', '2024', '2023'].includes(y),
)

export function usePracticeBuilder() {
  const [step, setStep] = useState(0)
  const [subjects, setSubjects] = useState<SubjectKey[]>([])
  const [years, setYears] = useState<string[]>(DEFAULT_YEARS)
  const [questionCount, setQuestionCount] = useState(50)

  const filters = useMemo<PracticeFilters>(
    () => ({
      subjects,
      years,
      questionCount,
      randomize: true,
    }),
    [subjects, years, questionCount],
  )

  const matchingCount = useMemo(
    () => countMatchingQuestions(filters),
    [filters],
  )

  const effectiveCount = Math.min(questionCount, matchingCount)

  const canProceedStep0 = subjects.length > 0
  const canProceedStep1 = years.length > 0
  const canGenerate = matchingCount > 0 && effectiveCount > 0

  const toggleSubject = (key: SubjectKey) => {
    setSubjects((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    )
  }

  const toggleYear = (year: string) => {
    setYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    )
  }

  const goNext = () => setStep((s) => Math.min(s + 1, 2))
  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  return {
    step,
    subjects,
    years,
    questionCount,
    setQuestionCount,
    matchingCount,
    effectiveCount,
    canProceedStep0,
    canProceedStep1,
    canGenerate,
    toggleSubject,
    toggleYear,
    goNext,
    goBack,
    filters,
    availableYears: DEFAULT_YEARS,
  }
}
