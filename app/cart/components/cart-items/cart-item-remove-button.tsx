import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import * as React from 'react'

interface CartItemRemoveButtonProps {
  onRemove: () => void
}

const CartItemRemoveButton: React.FC<CartItemRemoveButtonProps> = ({ onRemove }) => (
  <Button
    type='button'
    variant='link'
    className='font-bold text-md ml-2 text-gray-950 underline hover:text-gray-700 transition focus:outline-none cursor-pointer'
    onClick={onRemove}
    aria-label='Xoá'
  >
    <Trash2Icon className='size-5 text-inherit' strokeWidth={1.5} />
  </Button>
)

export default CartItemRemoveButton
