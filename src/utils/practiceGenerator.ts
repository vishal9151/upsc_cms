import type { PracticeFilters, PracticeTestConfig } from '@/types/practice'
import { getSubjectLabel } from '@/types/subject'
import {
  buildQuestionCatalog,
  deduplicatePool,
  filterPoolBySubjects,
  filterPoolByYears,
  reindexQuestions,
  shufflePool,
  takePoolCount,
} from '@/utils/questionPool'
import { savePracticeConfig } from '@/utils/practiceStorage'

function createTestId(): string {
  return crypto.randomUUID()
}

function buildPracticeLabel(filters: PracticeFilters): string {
  const subjectLabels = filters.subjects
    .slice(0, 2)
    .map((key) => getSubjectLabel(key))
  const subjectPart =
    subjectLabels.length > 0
      ? subjectLabels.join(', ') +
        (filters.subjects.length > 2 ? ` +${filters.subjects.length - 2}` : '')
      : 'Mixed Subjects'

  const years =
    filters.years.length > 0
      ? [...filters.years].sort((a, b) => Number(b) - Number(a)).join(', ')
      : 'All Years'

  return `${subjectPart} · ${years}`
}

export function generatePracticeTest(
  filters: PracticeFilters,
): PracticeTestConfig | null {
  let pool = buildQuestionCatalog()
  pool = filterPoolByYears(pool, filters.years)
  pool = filterPoolBySubjects(pool, filters.subjects)
  pool = deduplicatePool(pool)

  if (pool.length === 0) return null

  const count = Math.min(filters.questionCount, pool.length)
  if (count <= 0) return null

  if (filters.randomize !== false) {
    pool = shufflePool(pool)
  }

  const selected = takePoolCount(pool, count)
  const questions = reindexQuestions(selected)
  const testId = createTestId()
  const createdAt = new Date().toISOString()

  const config: PracticeTestConfig = {
    version: 1,
    testId,
    label: buildPracticeLabel({ ...filters, questionCount: count }),
    filters: { ...filters, questionCount: count },
    questions,
    createdAt,
    examMode: 'practice',
    isTimed: false,
  }

  savePracticeConfig(config)
  return config
}

export function regeneratePracticeTest(
  filters: PracticeFilters,
): PracticeTestConfig | null {
  return generatePracticeTest(filters)
}
