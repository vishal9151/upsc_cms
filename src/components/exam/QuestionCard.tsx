import { motion, AnimatePresence } from 'framer-motion'
import { useExamStore, useCurrentAnswer, useIsExamReadOnly } from '@/store/examStore'
import { Card } from '@/components/ui/Card'
import { cn } from '@/utils/cn'
import { formatOptionText, formatQuestionText } from '@/utils/textFormatter'

export function QuestionCard() {
  const currentQuestionIndex = useExamStore((s) => s.currentQuestionIndex)
  const questions = useExamStore((s) => s.questions)
  const selectAnswer = useExamStore((s) => s.selectAnswer)
  const currentAnswer = useCurrentAnswer()
  const isReadOnly = useIsExamReadOnly()

  const question = questions[currentQuestionIndex]

  if (!question) return null

  return (
    <Card>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {currentQuestionIndex + 1}
            </span>
            <p className="whitespace-pre-line text-base leading-relaxed text-gray-900 dark:text-gray-100">
              {formatQuestionText(question.question)}
            </p>
          </div>

          <fieldset>
            <legend className="sr-only">
              Select an answer for question {currentQuestionIndex + 1}
            </legend>
            <div
              className="space-y-3"
              role="radiogroup"
              aria-label={`Options for question ${currentQuestionIndex + 1}`}
            >
              {question.options.map((option, index) => {
                const isSelected = currentAnswer === index
                const optionId = `q${currentQuestionIndex}-opt${index}`

                return (
                  <label
                    key={optionId}
                    htmlFor={optionId}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-4 sm:p-4 min-h-11',
                      isReadOnly ? 'cursor-default' : 'cursor-pointer',
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/50'
                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600',
                    )}
                  >
                    <input
                      type="radio"
                      id={optionId}
                      name={`question-${currentQuestionIndex}`}
                      value={index}
                      checked={isSelected}
                      onChange={() => selectAnswer(index)}
                      disabled={isReadOnly}
                      className="sr-only"
                    />
                    <span
                      className={cn(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold',
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-500'
                          : 'border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400',
                      )}
                      aria-hidden="true"
                    >
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {formatOptionText(option)}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        </motion.div>
      </AnimatePresence>
    </Card>
  )
}
