import type { PracticeFilters, PoolEntry } from '@/types/practice'
import { resolvePracticeExamKey } from '@/types/practice'
import type { Question } from '@/types/exam'
import type { ExamKey } from '@/types/exams'
import { DEFAULT_EXAM_KEY } from '@/types/exams'
import { getExamPapers, getPaperQuestions } from '@/utils/paperData'

const catalogCache = new Map<ExamKey, PoolEntry[]>()

function normalizeDedupKey(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

export function buildQuestionCatalog(
  examKey: ExamKey = DEFAULT_EXAM_KEY,
): PoolEntry[] {
  const cached = catalogCache.get(examKey)
  if (cached) return cached

  const catalog: PoolEntry[] = []

  for (const paper of getExamPapers(examKey)) {
    const questions = getPaperQuestions(paper.year, paper.paper, examKey)
    for (const question of questions) {
      catalog.push({
        ...question,
        sourceYear: paper.year,
        sourcePaper: paper.paper,
        sourceId: question.id,
        sourceExamKey: examKey,
        dedupKey: normalizeDedupKey(question.question),
      })
    }
  }

  catalogCache.set(examKey, catalog)
  return catalog
}

export function examHasSubTopics(examKey: ExamKey = DEFAULT_EXAM_KEY): boolean {
  return buildQuestionCatalog(examKey).some(
    (q) => (q.sub_topics?.length ?? 0) > 0,
  )
}

export function getCatalogYears(examKey: ExamKey = DEFAULT_EXAM_KEY): string[] {
  const years = new Set<string>()
  for (const paper of getExamPapers(examKey, { visibleOnly: true })) {
    years.add(paper.year)
  }
  return Array.from(years).sort((a, b) => Number(b) - Number(a))
}

export function filterPoolByYears(
  pool: PoolEntry[],
  years: string[],
): PoolEntry[] {
  if (years.length === 0) return pool
  const yearSet = new Set(years)
  return pool.filter((q) => yearSet.has(q.sourceYear))
}

export function filterPoolBySubjects(
  pool: PoolEntry[],
  subjects: PracticeFilters['subjects'],
): PoolEntry[] {
  if (subjects.length === 0) return pool
  const subjectSet = new Set(subjects)
  return pool.filter((q) =>
    (q.subject_keys ?? []).some((key) => subjectSet.has(key)),
  )
}

export function filterPoolBySubTopics(
  pool: PoolEntry[],
  subTopics: PracticeFilters['subTopics'],
): PoolEntry[] {
  if (subTopics === undefined) return pool
  if (subTopics.length === 0) return []
  const topicSet = new Set(subTopics)
  return pool.filter((q) =>
    (q.sub_topics ?? []).some((topic) => topicSet.has(topic)),
  )
}

export function deduplicatePool(pool: PoolEntry[]): PoolEntry[] {
  const seen = new Set<string>()
  const result: PoolEntry[] = []
  for (const entry of pool) {
    if (seen.has(entry.dedupKey)) continue
    seen.add(entry.dedupKey)
    result.push(entry)
  }
  return result
}

export function shufflePool(pool: PoolEntry[]): PoolEntry[] {
  const copy = [...pool]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function takePoolCount(pool: PoolEntry[], count: number): PoolEntry[] {
  return pool.slice(0, count)
}

export function reindexQuestions(entries: PoolEntry[]): Question[] {
  return entries.map((entry, index) => {
    const {
      sourceYear,
      sourcePaper,
      sourceId,
      sourceExamKey,
      dedupKey,
      ...question
    } = entry
    void sourceYear
    void sourcePaper
    void sourceId
    void sourceExamKey
    void dedupKey
    return { ...question, id: index + 1 }
  })
}

export function countMatchingQuestions(filters: PracticeFilters): number {
  const examKey = resolvePracticeExamKey(filters)
  let pool = buildQuestionCatalog(examKey)
  pool = filterPoolByYears(pool, filters.years)
  pool = filterPoolBySubjects(pool, filters.subjects)
  pool = filterPoolBySubTopics(pool, filters.subTopics)
  pool = deduplicatePool(pool)
  return pool.length
}
