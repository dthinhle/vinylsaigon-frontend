import { IAddress } from '../types/order'

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

export function genFullAddress(addressObj: IAddress): string {
  const { address, ward, district, city } = addressObj

  let stringAddress = address
  if (ward) stringAddress += `, ${ward}`
  if (district) stringAddress += `, ${district}`
  if (city) stringAddress += `, ${city}`

  return stringAddress
}

export interface PriceInfo {
  originalPrice: number
  currentPrice: number
  displayPrice: number | null
  isOnSale: boolean
  discountPercentage: number
}

export function calculatePriceInfo(
  originalPriceValue: string | number | undefined,
  currentPriceValue: string | number | undefined,
): PriceInfo {
  const originalPrice = originalPriceValue
    ? typeof originalPriceValue === 'string'
      ? parseFloat(originalPriceValue)
      : originalPriceValue
    : 0

  const currentPrice = currentPriceValue
    ? typeof currentPriceValue === 'string'
      ? parseFloat(currentPriceValue)
      : currentPriceValue
    : 0

  const displayPrice = currentPrice || originalPrice || null
  const isOnSale = currentPrice > 0 && originalPrice > 0 && originalPrice > currentPrice
  const discountPercentage = isOnSale
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0

  return {
    originalPrice,
    currentPrice,
    displayPrice,
    isOnSale,
    discountPercentage,
  }
}
