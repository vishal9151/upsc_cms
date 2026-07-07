import { motion, type HTMLMotionProps } from 'framer-motion'
import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={
          hoverable
            ? { y: -4, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }
            : undefined
        }
        transition={{ duration: 0.2 }}
        className={cn(
          'rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900',
          hoverable && 'cursor-default',
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)

Card.displayName = 'Card'
