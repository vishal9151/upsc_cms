import type { PracticeFilters, PoolEntry } from '@/types/practice'
import type { Question } from '@/types/exam'
import { EXAM_YEARS } from '@/utils/paperData'
import { getPaperQuestions } from '@/utils/paperData'

let catalogCache: PoolEntry[] | null = null

const PAPER_IDS = ['paper1', 'paper2'] as const

function normalizeDedupKey(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim()
}

export function buildQuestionCatalog(): PoolEntry[] {
  if (catalogCache) return catalogCache

  const catalog: PoolEntry[] = []

  for (const year of EXAM_YEARS) {
    for (const paper of PAPER_IDS) {
      const questions = getPaperQuestions(year, paper)
      for (const question of questions) {
        catalog.push({
          ...question,
          sourceYear: year,
          sourcePaper: paper,
          sourceId: question.id,
          dedupKey: normalizeDedupKey(question.question),
        })
      }
    }
  }

  catalogCache = catalog
  return catalog
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
    const { sourceYear, sourcePaper, sourceId, dedupKey, ...question } = entry
    void sourceYear
    void sourcePaper
    void sourceId
    void dedupKey
    return { ...question, id: index + 1 }
  })
}

export function countMatchingQuestions(filters: PracticeFilters): number {
  let pool = buildQuestionCatalog()
  pool = filterPoolByYears(pool, filters.years)
  pool = filterPoolBySubjects(pool, filters.subjects)
  pool = deduplicatePool(pool)
  return pool.length
}
