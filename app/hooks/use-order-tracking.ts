import { searchOrder } from '@/app/api/order'
import { IOrder } from '@/lib/types/order'
import { isEmpty } from 'lodash'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { useToast } from '../cart/ui/toast'

export function useOrderTracking() {
  const [order, setOrder] = useState<IOrder | null>(null)
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [fetching, setFetching] = useState<boolean>(true)

  const { addToast } = useToast()

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback((name: string, value: string) => {
    const params = new URLSearchParams()
    params.set(name, value)

    return params.toString()
  }, [])

  const handleSearch = useCallback(
    async (email: string, orderNumber: string) => {
      setLoading(true)
      try {
        const res = await searchOrder(email, orderNumber)
        const foundOrder = res.data.order
        setOrder(foundOrder)
        setShowDetails(true)

        router.push(
          pathname +
            '?' +
            createQueryString('email', email) +
            '&' +
            createQueryString('order_number', orderNumber),
        )
      } catch (err: any) {
        const message =
          err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi tìm kiếm đơn hàng'

        addToast({
          type: 'error',
          title: '',
          message: message,
          duration: 5000,
        })

        setOrder(null)
        setShowDetails(false)
      } finally {
        setLoading(false)
        setFetching(false)
      }
    },
    [createQueryString, pathname, router, addToast],
  )

  useEffect(() => {
    const email = searchParams.get('email')
    const orderNumber = searchParams.get('order_number')

    if (email && orderNumber && isEmpty(order)) {
      setFetching(true)
      handleSearch(email, orderNumber)
    } else {
      setFetching(false)
    }
  }, [handleSearch, order, searchParams])

  useEffect(() => {
    if (searchParams.get('email') === null && searchParams.get('order_number') === null) {
      setOrder(null)
      setShowDetails(false)
    }
  }, [searchParams])

  return {
    order,
    showDetails,
    loading,
    handleSearch,
    setOrder,
    setShowDetails,
    fetching,
  }
}
