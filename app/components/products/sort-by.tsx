import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSortBy } from 'react-instantsearch'

interface SortByItem {
  value: string
  label: string
}

interface ProductSortByProps {
  items: SortByItem[]
  className?: string
  placeholder?: string
}

export const ProductSortBy = ({
  items,
  className,
  placeholder = 'Sắp xếp theo',
}: ProductSortByProps) => {
  const { currentRefinement, options, refine, canRefine } = useSortBy({ items })

  const handleValueChange = (value: string) => {
    refine(value)
  }

  const currentOption = options.find((option: SortByItem) => option.value === currentRefinement)

  return (
    <Select value={currentRefinement} onValueChange={handleValueChange} disabled={!canRefine}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>{currentOption?.label || placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent
        className='bg-white z-50'
        style={{
          '--input': 'var(--color-gray-300)',
        } as React.CSSProperties}
      >
        {options.map((option: SortByItem) => (
          <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
