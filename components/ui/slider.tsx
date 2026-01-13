'use client'

import { cn } from '@/lib/utils'
import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

function Slider({
  className,
  defaultValue,
  value,
  onValueChange,
  onValueCommit,
  showLabel,
  formatLabel,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  onValueChange?: (value: number[]) => void
  onValueCommit?: (value: number[]) => void
  showLabel?: boolean
  formatLabel?: (value: number) => string
}) {
  const values = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max]),
    [value, defaultValue, min, max],
  )

  return (
    <>
      <SliderPrimitive.Root
        data-slot='slider'
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
        className={cn(
          'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot='slider-track'
          className={cn(
            'bg-gray-400 relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
          )}
        >
          <SliderPrimitive.Range
            data-slot='slider-range'
            className={cn(
              'bg-sea-buckthorn-400 absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full',
            )}
          />
        </SliderPrimitive.Track>
        {values.map((_value, index) => (
          <SliderPrimitive.Thumb
            data-slot='slider-thumb'
            key={index}
            className='bg-white border-sea-buckthorn-400 ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50'
          />
        ))}
      </SliderPrimitive.Root>
      {showLabel && (
        <div className='flex justify-between'>
          {values.map((value, index) => (
            <div key={`label-${index}`} className='text-sm mt-2'>
              {formatLabel ? formatLabel(value) : value}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export { Slider }
