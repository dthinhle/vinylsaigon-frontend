import { Input as BaseInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import * as React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  loading?: boolean
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  error,
  loading,
  icon,
  disabled,
  className,
  ...props
}) => (
  <div className='relative w-full'>
    {icon && (
      <span className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
        {icon}
      </span>
    )}
    <BaseInput
      aria-label={props['aria-label'] || props.name || 'Input field'}
      aria-invalid={!!error}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      disabled={disabled || loading}
      tabIndex={0}
      className={cn(
        'w-full px-4 py-2 border transition disabled:opacity-50 disabled:cursor-not-allowed rounded-none',
        icon ? 'pl-10' : '',
        error ? 'border-red-500' : 'border-gray-300',
        className,
      )}
      {...props}
    />
    {loading && (
      <span
        className='absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 border-2 border-atomic-tangerine-300 border-t-transparent rounded-full'
        aria-label='Loading'
      />
    )}
  </div>
)
