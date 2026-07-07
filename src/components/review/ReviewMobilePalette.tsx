import { useState } from 'react'
import { LayoutGrid } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { QuestionResult } from '@/types/result'
import { ReviewPalette } from '@/components/review/ReviewPalette'
import { Button } from '@/components/ui/Button'

interface ReviewMobilePaletteProps {
  questionResults: QuestionResult[]
  currentIndex: number
  filteredIndices: number[]
  onSelect: (index: number) => void
}

export function ReviewMobilePalette({
  questionResults,
  currentIndex,
  filteredIndices,
  onSelect,
}: ReviewMobilePaletteProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-30 min-h-11 gap-2 rounded-full px-4 shadow-lg lg:hidden"
        aria-label="Open review question palette"
      >
        <LayoutGrid className="h-5 w-5" />
        Question Palette
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.25 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-900 lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Review question palette"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  Question Palette
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                  className="min-h-11"
                >
                  Close
                </Button>
              </div>
              <ReviewPalette
                questionResults={questionResults}
                currentIndex={currentIndex}
                filteredIndices={filteredIndices}
                onSelect={(index) => {
                  onSelect(index)
                  setOpen(false)
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
