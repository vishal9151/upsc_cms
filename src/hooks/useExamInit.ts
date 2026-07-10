import { useCallback, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useExamStore } from '@/store/examStore'
import type { ExamMeta } from '@/types/exam'
import type { PersistedExamState } from '@/types/persistence'
import { CUSTOM_EXAM_YEAR } from '@/types/practice'
import { deleteExam, isUnfinishedExam, loadExam } from '@/utils/examStorage'
import {
  isCustomExamYear,
  loadPracticeConfig,
} from '@/utils/practiceStorage'
import { resolveExamQuestions } from '@/utils/questionResolver'

type ResumeAction = 'continue' | 'fresh'

function buildExamMeta(year: string, paper: string): ExamMeta {
  if (isCustomExamYear(year)) {
    const config = loadPracticeConfig(paper)
    return {
      year,
      paper,
      examMode: 'practice',
      isTimed: false,
      practiceLabel: config?.label,
    }
  }
  return { year, paper, examMode: 'pyq', isTimed: true }
}

export function useExamInit() {
  const { year, paper } = useParams<{ year: string; paper: string }>()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const initExam = useExamStore((s) => s.initExam)
  const restoreExam = useExamStore((s) => s.restoreExam)
  const reset = useExamStore((s) => s.reset)
  const setHydrated = useExamStore((s) => s.setHydrated)
  const examStarted = useExamStore((s) => s.examStarted)
  const isHydrated = useExamStore((s) => s.isHydrated)

  const [needsResume, setNeedsResume] = useState(false)
  const [savedExam, setSavedExam] = useState<PersistedExamState | null>(null)

  const forceNew =
    searchParams.get('new') === 'true' ||
    (location.state as { forceNew?: boolean } | null)?.forceNew === true

  const resumeAction = (
    location.state as { resumeAction?: ResumeAction } | null
  )?.resumeAction

  const startFresh = useCallback(() => {
    if (!year || !paper) return
    const questions = resolveExamQuestions(year, paper)
    if (questions.length === 0) return
    deleteExam(year, paper)
    initExam(buildExamMeta(year, paper), questions)
    setNeedsResume(false)
    setSavedExam(null)
  }, [year, paper, initExam])

  const continueExam = useCallback(() => {
    if (!year || !paper) return
    const saved = loadExam(year, paper)
    const questions = resolveExamQuestions(year, paper)
    if (!saved || questions.length === 0) return
    restoreExam(buildExamMeta(year, paper), questions, saved)
    setNeedsResume(false)
    setSavedExam(null)
  }, [year, paper, restoreExam])

  useLayoutEffect(() => {
    if (!year || !paper) return

    setNeedsResume(false)
    setSavedExam(null)

    const questions = resolveExamQuestions(year, paper)
    if (questions.length === 0) {
      reset()
      if (isCustomExamYear(year)) {
        navigate('/practice', { replace: true })
      }
      return
    }

    const meta = buildExamMeta(year, paper)

    if (forceNew || resumeAction === 'fresh') {
      deleteExam(year, paper)
      initExam(meta, questions)
      return
    }

    const saved = loadExam(year, paper)
    if (saved && isUnfinishedExam(saved)) {
      if (resumeAction === 'continue') {
        restoreExam(meta, questions, saved)
      } else {
        reset()
        setSavedExam(saved)
        setNeedsResume(true)
        setHydrated(true)
      }
      return
    }

    initExam(meta, questions)
  }, [
    year,
    paper,
    forceNew,
    resumeAction,
    initExam,
    restoreExam,
    reset,
    setHydrated,
    navigate,
  ])

  const cancelResume = useCallback(() => {
    reset()
    if (year === CUSTOM_EXAM_YEAR) {
      navigate('/practice')
      return
    }
    navigate('/')
  }, [year, navigate, reset])

  return {
    year: year ?? '',
    paper: paper ?? '',
    examStarted,
    isHydrated,
    needsResume,
    savedExam,
    continueExam,
    startFresh,
    cancelResume,
    isCustomExam: year ? isCustomExamYear(year) : false,
  }
}
