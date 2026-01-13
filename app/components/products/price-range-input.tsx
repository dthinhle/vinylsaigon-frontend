import { Slider } from '@/components/ui/slider'
import { formatPrice } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { RangeInputProps, useRange } from 'react-instantsearch'

interface PriceRangeInputProps {
  attribute: string
}

export const PriceRangeInput = (props: PriceRangeInputProps) => {
  const res = useRange(props as RangeInputProps)
  const { start, range, canRefine, refine } = res
  const { min, max } = range
  const [value, setValue] = useState<number[]>([min!, max!])

  const from = min && start[0] && Math.max(min, Number.isFinite(start[0]) ? start[0] : min)
  const to = max && start[1] && Math.min(max, Number.isFinite(start[1]) ? start[1] : max)

  useEffect(() => {
    setValue([from!, to!])
  }, [from, to])

  const handleValueCommit = () => {
    refine([value[0], value[1]])
  }

  return (
    <div className='px-2 pt-2'>
      <Slider
        min={min}
        max={max}
        value={value}
        onValueChange={setValue}
        onValueCommit={handleValueCommit}
        step={500}
        disabled={!canRefine}
        showLabel
        formatLabel={formatPrice}
      />
    </div>
  )
}
