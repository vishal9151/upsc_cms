import { useCallback, useEffect, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useExamStore } from '@/store/examStore'
import type { PersistedExamState } from '@/types/persistence'
import { deleteExam, isUnfinishedExam, loadExam } from '@/utils/examStorage'
import { getPaperQuestions } from '@/utils/paperData'

type InitStatus = 'loading' | 'resume-prompt' | 'ready'

type ResumeAction = 'continue' | 'fresh'

export function useExamInit() {
  const { year, paper } = useParams<{ year: string; paper: string }>()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const initExam = useExamStore((s) => s.initExam)
  const restoreExam = useExamStore((s) => s.restoreExam)
  const reset = useExamStore((s) => s.reset)
  const examStarted = useExamStore((s) => s.examStarted)

  const [status, setStatus] = useState<InitStatus>('loading')
  const [savedExam, setSavedExam] = useState<PersistedExamState | null>(null)

  const forceNew =
    searchParams.get('new') === 'true' ||
    (location.state as { forceNew?: boolean } | null)?.forceNew === true

  const resumeAction = (
    location.state as { resumeAction?: ResumeAction } | null
  )?.resumeAction

  const startFresh = useCallback(() => {
    if (!year || !paper) return
    const questions = getPaperQuestions(year, paper)
    if (questions.length === 0) return
    deleteExam(year, paper)
    initExam({ year, paper }, questions)
    setStatus('ready')
    setSavedExam(null)
  }, [year, paper, initExam])

  const continueExam = useCallback(() => {
    if (!year || !paper) return
    const saved = loadExam(year, paper)
    const questions = getPaperQuestions(year, paper)
    if (!saved || questions.length === 0) return
    restoreExam({ year, paper }, questions, saved)
    setStatus('ready')
    setSavedExam(null)
  }, [year, paper, restoreExam])

  useEffect(() => {
    if (!year || !paper) return

    const questions = getPaperQuestions(year, paper)
    if (questions.length === 0) return

    if (forceNew || resumeAction === 'fresh') {
      deleteExam(year, paper)
      initExam({ year, paper }, questions)
      setStatus('ready')
      setSavedExam(null)
    } else {
      const saved = loadExam(year, paper)
      if (saved && isUnfinishedExam(saved)) {
        if (resumeAction === 'continue') {
          restoreExam({ year, paper }, questions, saved)
          setStatus('ready')
          setSavedExam(null)
        } else {
          setSavedExam(saved)
          setStatus('resume-prompt')
        }
      } else {
        initExam({ year, paper }, questions)
        setStatus('ready')
        setSavedExam(null)
      }
    }

    return () => {
      reset()
      setStatus('loading')
      setSavedExam(null)
    }
  }, [year, paper, forceNew, resumeAction, initExam, restoreExam, reset])

  return {
    year: year ?? '',
    paper: paper ?? '',
    examStarted,
    isHydrated: status !== 'loading',
    needsResume: status === 'resume-prompt',
    savedExam,
    continueExam,
    startFresh,
  }
}
