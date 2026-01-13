import { Badge } from '@/components/ui/badge'
import { IProduct } from '@/lib/types/product'
import * as React from 'react'

type ProductBadgeProps = {
  badgeText: string
}

const ProductBadge = React.memo(({ badgeText }: ProductBadgeProps) => (
  <Badge
    variant='secondary'
    className='px-1.5 py-0.5 text-sm border rounded-sm border-gray-900'
    style={
      {
        '--secondary': 'white',
        '--secondary-foreground': 'var(--color-gray-900)',
      } as React.CSSProperties
    }
  >
    {badgeText}
  </Badge>
))

ProductBadge.displayName = 'ProductBadge'

const ProductBadges = ({ product }: { product: IProduct }) => {
  const badges = React.useMemo(() => {
    const allBadges = []

    if (product.flags.includes('arrive-soon')) {
      allBadges.push(['badge-arrive-soon', 'Sắp về hàng'])
    }

    if (product.flags.includes('backorder')) {
      allBadges.push(['badge-backorder', 'Đặt hàng trước'])
    }

    if (product.flags.includes('just-arrived')) {
      allBadges.push(['badge-just-arrived', 'Mới'])
    }

    return allBadges
  }, [product.flags])

  if (badges.length === 0) return null

  return (
    <div className='flex flex-row gap-2.5 lg:mt-2 mt-4'>
      {badges.map(([badgeKey, badgeContent]) => (
        <ProductBadge key={badgeKey} badgeText={badgeContent} />
      ))}
    </div>
  )
}

export default ProductBadges
