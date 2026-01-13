import { useCartStore } from '@/app/store/cart-store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'
import * as React from 'react'

interface QuantityControlsProps {
  value: number
  onChange: (newQuantity: number) => void
  min?: number
  max?: number
}

const QuantityControls: React.FC<QuantityControlsProps> = ({
  value,
  onChange,
  min = 0,
  max = Infinity,
}) => {
  // Local state for immediate UI updates
  const [localValue, setLocalValue] = React.useState(value)
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const isLoading = useCartStore((state) => state.loading)

  // Sync local value when prop value changes (e.g., after API update)
  React.useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Cleanup debounce timer on unmount
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const handleQuantityChange = React.useCallback(
    (newQuantity: number) => {
      // Update local state immediately for responsive UI
      setLocalValue(newQuantity)

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Debounce the actual onChange call for API call
      debounceTimerRef.current = setTimeout(() => {
        onChange(newQuantity)
      }, 150)
    },
    [onChange],
  )

  const handleDecrease = () => {
    if (localValue > min) {
      handleQuantityChange(localValue - 1)
    }
  }

  const handleIncrease = () => {
    if (localValue < max) {
      handleQuantityChange(localValue + 1)
    }
  }

  return (
    <div className='flex items-center space-x-2' role='group' aria-label='Quantity controls'>
      <Button
        type='button'
        size='icon'
        className='shadow-none size-7 flex items-center justify-center text-lg font-bold bg-white hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-atomic-tangerine-300 cursor-pointer'
        onClick={handleDecrease}
        aria-label='Decrease quantity'
        disabled={localValue <= min}
      >
        <Minus className='size-4' aria-hidden='true' />
      </Button>
      <span className={cn('w-8 text-center select-none text-sm', isLoading && 'animate-pulse')} aria-live='polite'>
        {localValue}
      </span>
      <Button
        type='button'
        size='icon'
        className='shadow-none size-7 flex items-center justify-center text-lg font-bold bg-white hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-atomic-tangerine-300 cursor-pointer'
        onClick={handleIncrease}
        aria-label='Increase quantity'
        disabled={localValue >= max}
      >
        <Plus className='size-4' aria-hidden='true' />
      </Button>
    </div>
  )
}

export default QuantityControls
