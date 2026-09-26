import { useEffect, useMemo, useState } from 'react'
import type { PracticeFilters } from '@/types/practice'
import type { SubjectKey } from '@/types/subject'
import type { ExamKey } from '@/types/exams'
import { DEFAULT_EXAM_KEY } from '@/types/exams'
import { useExamKeyParam } from '@/hooks/useExamKeyParam'
import { countMatchingQuestions, getCatalogYears } from '@/utils/questionPool'

export function usePracticeBuilder(examKeyOverride?: ExamKey) {
  const routeExamKey = useExamKeyParam()
  const examKey = examKeyOverride ?? routeExamKey ?? DEFAULT_EXAM_KEY

  const availableYears = useMemo(() => getCatalogYears(examKey), [examKey])

  const [step, setStep] = useState(0)
  const [subjects, setSubjects] = useState<SubjectKey[]>([])
  const [years, setYears] = useState<string[]>(() => getCatalogYears(examKey))
  const [questionCount, setQuestionCount] = useState(50)

  useEffect(() => {
    setYears((prev) => {
      const stillValid = prev.filter((y) => availableYears.includes(y))
      return stillValid.length > 0 ? stillValid : [...availableYears]
    })
  }, [availableYears])

  const filters = useMemo<PracticeFilters>(
    () => ({
      subjects,
      years,
      questionCount,
      randomize: true,
      examKey,
    }),
    [subjects, years, questionCount, examKey],
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
    examKey,
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
    availableYears,
  }
}
