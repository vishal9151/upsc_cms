import { useEffect, useMemo, useState } from 'react'
import type { PracticeFilters } from '@/types/practice'
import type { SubjectKey } from '@/types/subject'
import {
  getFlatTopicsForSubjects,
  getTopicsForSubjects,
} from '@/types/syllabus'
import { countMatchingQuestions } from '@/utils/questionPool'
import { EXAM_YEARS } from '@/utils/paperData'

const DEFAULT_YEARS = [...EXAM_YEARS].filter((y) =>
  ['2025', '2024', '2023'].includes(y),
)

const LAST_STEP = 3

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

export function useTopicPracticeBuilder() {
  const [step, setStep] = useState(0)
  const [subjects, setSubjects] = useState<SubjectKey[]>([])
  const [subTopics, setSubTopics] = useState<string[]>([])
  const [years, setYears] = useState<string[]>(DEFAULT_YEARS)
  const [questionCount, setQuestionCount] = useState(50)

  useEffect(() => {
    setSubTopics((previous) => syncSubTopicsForSubjects(subjects, previous))
  }, [subjects])

  const topicGroups = useMemo(
    () => getTopicsForSubjects(subjects),
    [subjects],
  )

  const filters = useMemo<PracticeFilters>(
    () => ({
      subjects,
      subTopics,
      years,
      questionCount,
      randomize: true,
    }),
    [subjects, subTopics, years, questionCount],
  )

  const matchingCount = useMemo(
    () => countMatchingQuestions(filters),
    [filters],
  )

  const effectiveCount = Math.min(questionCount, matchingCount)

  const canProceedStep0 = subjects.length > 0
  const canProceedStep1 = subTopics.length > 0
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

  const goNext = () => setStep((current) => Math.min(current + 1, LAST_STEP))
  const goBack = () => setStep((current) => Math.max(current - 1, 0))

  return {
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
    availableYears: DEFAULT_YEARS,
  }
}
