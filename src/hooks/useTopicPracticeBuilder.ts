import { useEffect, useMemo, useState } from 'react'
import type { PracticeFilters } from '@/types/practice'
import type { SubjectKey } from '@/types/subject'
import type { ExamKey } from '@/types/exams'
import { DEFAULT_EXAM_KEY } from '@/types/exams'
import {
  getFlatTopicsForSubjects,
  getTopicsForSubjects,
} from '@/types/syllabus'
import { useExamKeyParam } from '@/hooks/useExamKeyParam'
import {
  countMatchingQuestions,
  examHasSubTopics,
  getCatalogYears,
} from '@/utils/questionPool'

function syncSubTopicsForSubjects(
  subjects: SubjectKey[],
  previous: string[],
): string[] {
  if (subjects.length === 0) return []

  const topicGroups = getTopicsForSubjects(subjects)
  const allTopics = getFlatTopicsForSubjects(subjects)
  const allSet = new Set(allTopics)
  const kept = previous.filter((topic) => allSet.has(topic))
  const keptSet = new Set(kept)
  const result = new Set(kept)

  for (const group of topicGroups) {
    const hasAny = group.topics.some((topic) => keptSet.has(topic))
    if (!hasAny) {
      for (const topic of group.topics) {
        result.add(topic)
      }
    }
  }

  return Array.from(result)
}

export function useTopicPracticeBuilder(examKeyOverride?: ExamKey) {
  const routeExamKey = useExamKeyParam()
  const examKey = examKeyOverride ?? routeExamKey ?? DEFAULT_EXAM_KEY

  const availableYears = useMemo(() => getCatalogYears(examKey), [examKey])
  const supportsSubTopics = useMemo(
    () => examHasSubTopics(examKey),
    [examKey],
  )

  const lastStep = supportsSubTopics ? 3 : 2

  const [step, setStep] = useState(0)
  const [subjects, setSubjects] = useState<SubjectKey[]>([])
  const [subTopics, setSubTopics] = useState<string[]>([])
  const [years, setYears] = useState<string[]>(() => getCatalogYears(examKey))
  const [questionCount, setQuestionCount] = useState(50)

  useEffect(() => {
    setYears((prev) => {
      const stillValid = prev.filter((y) => availableYears.includes(y))
      return stillValid.length > 0 ? stillValid : [...availableYears]
    })
  }, [availableYears])

  useEffect(() => {
    if (!supportsSubTopics) {
      setSubTopics([])
      return
    }
    setSubTopics((previous) => syncSubTopicsForSubjects(subjects, previous))
  }, [subjects, supportsSubTopics])

  const topicGroups = useMemo(
    () => getTopicsForSubjects(subjects),
    [subjects],
  )

  const filters = useMemo<PracticeFilters>(() => {
    const base: PracticeFilters = {
      subjects,
      practiceKind: 'topic',
      years,
      questionCount,
      randomize: true,
      examKey,
    }
    if (supportsSubTopics) {
      base.subTopics = subTopics
    }
    return base
  }, [
    subjects,
    subTopics,
    years,
    questionCount,
    examKey,
    supportsSubTopics,
  ])

  const matchingCount = useMemo(
    () => countMatchingQuestions(filters),
    [filters],
  )

  const effectiveCount = Math.min(questionCount, matchingCount)

  const canProceedStep0 = subjects.length > 0
  const canProceedStep1 = supportsSubTopics
    ? subTopics.length > 0
    : years.length > 0
  const canProceedStep2 = years.length > 0
  const canGenerate = matchingCount > 0 && effectiveCount > 0

  const toggleSubject = (key: SubjectKey) => {
    setSubjects((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    )
  }

  const toggleSubTopic = (topic: string) => {
    setSubTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((item) => item !== topic)
        : [...prev, topic],
    )
  }

  const selectAllSubTopics = () => {
    setSubTopics(getFlatTopicsForSubjects(subjects))
  }

  const clearAllSubTopics = () => {
    setSubTopics([])
  }

  const toggleYear = (year: string) => {
    setYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year],
    )
  }

  const goNext = () => setStep((current) => Math.min(current + 1, lastStep))
  const goBack = () => setStep((current) => Math.max(current - 1, 0))

  return {
    examKey,
    supportsSubTopics,
    lastStep,
    step,
    subjects,
    subTopics,
    years,
    questionCount,
    setQuestionCount,
    topicGroups,
    matchingCount,
    effectiveCount,
    canProceedStep0,
    canProceedStep1,
    canProceedStep2,
    canGenerate,
    toggleSubject,
    toggleSubTopic,
    selectAllSubTopics,
    clearAllSubTopics,
    toggleYear,
    goNext,
    goBack,
    filters,
    availableYears,
  }
}
