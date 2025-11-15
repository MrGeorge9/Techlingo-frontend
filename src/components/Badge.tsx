import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 dark:from-gray-700 dark:to-gray-600 dark:text-gray-200',
      primary: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-700 dark:from-primary-900/70 dark:to-primary-800/70 dark:text-primary-200',
      success: 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 dark:from-green-900/70 dark:to-green-800/70 dark:text-green-200',
      warning: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700 dark:from-yellow-900/70 dark:to-yellow-800/70 dark:text-yellow-200',
      danger: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 dark:from-red-900/70 dark:to-red-800/70 dark:text-red-200',
    }

    const sizes = {
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-semibold shadow-sm',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'
