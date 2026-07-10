import { BackToExamList } from '@/components/layout/BackToExamList'
import { ExamHeader } from '@/components/exam/ExamHeader'
import { SubmitTestButton } from '@/components/exam/SubmitTestButton'
import { SubmitModal, TimeUpModal } from '@/components/exam/ExamModals'
import { ExamNavigation } from '@/components/exam/ExamNavigation'
import { MobilePaletteFab } from '@/components/exam/MobilePaletteFab'
import { ResumeModal } from '@/components/exam/ResumeModal'
import { ExamProgress, ExamSidebar } from '@/components/exam/ExamSidebar'
import { QuestionCard } from '@/components/exam/QuestionCard'
import { useExamInit } from '@/hooks/useExamInit'
import { useExamKeyboard } from '@/hooks/useExamKeyboard'
import { useExamPersistence } from '@/hooks/useExamPersistence'
import { useExamTimer } from '@/hooks/useExamTimer'
import { useExamStore } from '@/store/examStore'

export function Exam() {
  const {
    examStarted,
    isHydrated,
    needsResume,
    savedExam,
    continueExam,
    startFresh,
    cancelResume,
    isCustomExam,
  } = useExamInit()

  useExamTimer()
  useExamKeyboard()
  useExamPersistence()

  const questions = useExamStore((s) => s.questions)

  if (!isHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading exam...</p>
      </div>
    )
  }

  if (needsResume && savedExam) {
    return (
      <ResumeModal
        open
        savedExam={savedExam}
        isTimed={!isCustomExam}
        onContinue={continueExam}
        onStartAgain={startFresh}
        onCancel={cancelResume}
      />
    )
  }

  if (!examStarted || questions.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading exam...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-3">
        <BackToExamList variant="header" />
        <SubmitTestButton className="hidden sm:inline-flex" />
      </div>
      <div className="mb-1 flex items-center justify-between gap-3 sm:hidden">
        <BackToExamList variant="below" />
        <SubmitTestButton compact />
      </div>

      <ExamHeader />
      <ExamProgress className="hidden sm:block" />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-6">
          <QuestionCard />
          <ExamNavigation />
        </div>
        <ExamSidebar />
      </div>

      <MobilePaletteFab />
      <SubmitModal />
      <TimeUpModal />
    </div>
  )
}
