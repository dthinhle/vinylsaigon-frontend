'use client'

import type { Promotion } from '@/app/cart/types/cart.types'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn, formatPrice } from '@/lib/utils'
import { BadgeCheck } from 'lucide-react'

interface BundleBadgeProps {
  promotion: Promotion
  badgeClassName?: string
}

export const BundleBadge: React.FC<BundleBadgeProps> = ({ promotion, badgeClassName }) => {
  if (promotion.discountType !== 'bundle' || !promotion.bundleItems) {
    return null
  }

  const discountAmount = parseFloat(promotion.discountValue)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant='bundle' className={cn('gap-1', badgeClassName)}>
          <BadgeCheck className='size-3' />
        </Badge>
      </TooltipTrigger>
      <TooltipContent
        className='max-w-xs bg-gray-950 text-white px-3 py-2.5'
        style={
          {
            '--foreground': 'var(--color-gray-950)',
            '--background': 'white',
          } as React.CSSProperties
        }
      >
        <div className='space-y-2'>
          <strong className='block text-sm font-semibold'>
            Giảm giá theo combo {promotion.code}
          </strong>
          <ul className='list-disc list-inside text-xs space-y-1'>
            {promotion.bundleItems.map((item, idx) => (
              <li key={idx}>
                {item.productName}
                {item.variantName && ` (${item.variantName})`} &times; {item.quantity}
              </li>
            ))}
          </ul>
          <p className='text-xs font-medium'>Số tiền giảm: {formatPrice(discountAmount)}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
