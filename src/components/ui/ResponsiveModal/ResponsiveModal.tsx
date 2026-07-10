import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/utils/cn'

interface ResponsiveModalProps {
  open: boolean
  onClose: () => void
  titleId: string
  children: ReactNode
  className?: string
  /** Keep the dialog centered on all screen sizes instead of a mobile bottom sheet. */
  centered?: boolean
}

export function ResponsiveModal({
  open,
  onClose,
  titleId,
  children,
  className,
  centered = false,
}: ResponsiveModalProps) {
  const isMobile = useIsMobile()
  const panelRef = useRef<HTMLDivElement>(null)
  const useCenteredLayout = centered || !isMobile

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed inset-0 z-[100] flex justify-center bg-black/50',
            useCenteredLayout ? 'items-center p-4' : 'items-end p-0',
          )}
          role="presentation"
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={
              useCenteredLayout
                ? { opacity: 0, scale: 0.95, y: 8 }
                : { y: '100%' }
            }
            animate={
              useCenteredLayout
                ? { opacity: 1, scale: 1, y: 0 }
                : { y: 0 }
            }
            exit={
              useCenteredLayout
                ? { opacity: 0, scale: 0.95, y: 8 }
                : { y: '100%' }
            }
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'w-full border border-gray-200 bg-white shadow-lg focus:outline-none dark:border-gray-800 dark:bg-gray-900',
              useCenteredLayout
                ? 'max-h-[min(90vh,calc(100dvh-2rem))] max-w-md overflow-y-auto rounded-2xl p-6'
                : 'max-h-[90vh] overflow-y-auto rounded-t-2xl p-6',
              className,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
