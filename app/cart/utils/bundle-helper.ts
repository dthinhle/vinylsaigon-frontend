import type { Cart, CartItem, Promotion } from '@/app/cart/types/cart.types'

export const getItemBundlePromotions = (item: CartItem, cart: Cart | null): Promotion[] => {
  if (!cart?.promotions || cart.promotions.length === 0) {
    return []
  }

  return cart.promotions.filter((promotion) => {
    if (promotion.discountType !== 'bundle' || !promotion.bundleItems) {
      return false
    }

    return promotion.bundleItems.some((bundleItem) => {
      if (!bundleItem.productVariantId) {
        return bundleItem.productId === item.productId
      }

      return (
        bundleItem.productId === item.productId &&
        bundleItem.productVariantId === item.productVariantId
      )
    })
  })
}
