import { formatPrice } from '@/lib/utils'
import * as React from 'react'

export interface OrderSummaryItemProps {
  label: string
  value: string | number
  formatString?: boolean
  bold?: boolean
}

export const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({
  label,
  value,
  formatString = false,
  bold = false,
}) => (
  <div className='flex justify-between py-0' role='row'>
    <span className={`text-md ${bold ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
      {label}
    </span>
    <span className={`text-md ${bold ? 'font-bold text-gray-900' : 'text-gray-800'}`}>
      {formatString ? formatPrice(value) : value}
    </span>
  </div>
)
