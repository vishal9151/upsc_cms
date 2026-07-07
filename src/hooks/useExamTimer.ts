import { useEffect, useRef } from 'react'
import { useExamStore } from '@/store/examStore'

export function useExamTimer() {
  const tickTimer = useExamStore((s) => s.tickTimer)
  const examStarted = useExamStore((s) => s.examStarted)
  const examCompleted = useExamStore((s) => s.examCompleted)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!examStarted || examCompleted) return

    intervalRef.current = setInterval(() => {
      tickTimer()
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [examStarted, examCompleted, tickTimer])
}
