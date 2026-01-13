'use client'

import { AccountSidebar } from '@/app/components/account'
import { BreadcrumbNav } from '@/app/components/page/breadcrumb-nav'
import { stylized } from '@/app/fonts'
import { Button } from '@/components/ui/button'
import { FRONTEND_PATH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import { IOrder, IOrdersResponse, OrderStatus, OrderStatusLabels } from '@/lib/types/order'

export function OrderContent() {
  const [selectedPeriod, setSelectedPeriod] = useState<'last6months' | 'lastyear' | 'alltime'>(
    'last6months',
  )
  const [orders, setOrders] = useState<IOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const [pagination, setPagination] = useState<IOrdersResponse['pagination'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await apiClient.get(`/orders?period=${selectedPeriod}&page=1`)
        setOrders(response.data.orders || [])
        setPagination(response.data.pagination || null)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError(getErrorMessage(err))
        setOrders([])
        setPagination(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [selectedPeriod])

  // Handle load more orders
  const handleLoadMore = async () => {
    if (!pagination || !pagination.currentPage || pagination.currentPage >= pagination.totalPages) return

    setLoadMoreLoading(true)
    try {
      const nextPage = pagination.currentPage + 1
      const response = await apiClient.get(`/orders?period=${selectedPeriod}&page=${nextPage}`)

      if (response.data.orders) {
        setOrders(prev => [...prev, ...response.data.orders])
        setPagination(response.data.pagination)
      }
    } catch (err) {
      console.error('Error loading more orders:', err)
      // Show error message to user for load more failures
      setError(getErrorMessage(err))
    } finally {
      setLoadMoreLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString))
  }

  const getErrorMessage = (err: unknown): string => {
    if (err instanceof Error) {
      if (err.message.includes('Network Error') || err.message.includes('fetch')) {
        return 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.'
      }
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      }
      if (err.message.includes('403') || err.message.includes('Forbidden')) {
        return 'Bạn không có quyền truy cập thông tin này.'
      }
      if (err.message.includes('404')) {
        return 'Không tìm thấy dữ liệu đơn hàng.'
      }
      if (err.message.includes('500')) {
        return 'Lỗi hệ thống. Vui lòng thử lại sau.'
      }
      return 'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.'
    }
    return 'Có lỗi không xác định. Vui lòng thử lại sau.'
  }

  const getStatusDisplay = (status: string) => {
    const statusStyling = {
      [OrderStatus.AWAITING_PAYMENT]: {
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
      },
      [OrderStatus.PAID]: {
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      },
      [OrderStatus.CANCELED]: {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
      },
      [OrderStatus.CONFIRMED]: {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
      },
      [OrderStatus.FULFILLED]: {
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-800',
      },
      [OrderStatus.REFUNDED]: {
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
      },
      [OrderStatus.FAILED]: {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
      },
      [OrderStatus.PENDING]: {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      },
      [OrderStatus.PROCESSING]: {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
      },
      [OrderStatus.SHIPPED]: {
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800',
      },
      [OrderStatus.DELIVERED]: {
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
      },
      [OrderStatus.CANCELLED]: {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
      },
    }

    const orderStatus = status as OrderStatus
    const styling = statusStyling[orderStatus] || {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
    }

    return {
      text: OrderStatusLabels[orderStatus] || status,
      bgColor: styling.bgColor,
      textColor: styling.textColor,
    }
  }

  const breadcrumbNodes = [
    {
      label: 'Trang chủ',
      link: FRONTEND_PATH.root,
    },
    {
      label: 'Tài khoản',
      link: FRONTEND_PATH.viewProfile,
    },
    {
      label: 'Đơn hàng của tôi',
      link: FRONTEND_PATH.orders,
    },
  ]

  return (
    <div className='max-w-screen-2xl mx-auto'>
      <div className='w-full mt-12 lg:mt-20 py-4 lg:py-8'>
        <div className='max-w-screen-2xl mx-auto p-4 lg:p-6 lg:px-20 lg:pt-8 lg:mt-0 mt-2'>
          {/* Breadcrumb - hidden on mobile */}
          <div className='lg:mb-4 lg:mt-0 mb-6 mt-6'>
            <BreadcrumbNav
              nodes={breadcrumbNodes.slice(0, -1)}
              renderLastSeparator={true}
              classNames={{ link: 'lg:text-sm text-black' }}
            />
            <h1
              className={cn(
                stylized.className,
                'scroll-m-20 text-black lg:text-2xl text-xl font-medium tracking-tight lg:mt-4 mt-3',
              )}
            >
              {breadcrumbNodes.at(-1)?.label}
            </h1>
          </div>

          <div className='flex flex-col lg:flex-row lg:gap-8 mt-8'>
            {/* Sidebar */}
            <div className='block lg:mb-0 mb-6'>
              <AccountSidebar currentPage='orders' />
            </div>

            {/* Orders Content */}
            <div className='flex-1 lg:border-l lg:border-gray-300 lg:pl-12'>
              <div className='mb-8'>
                <h2 className='font-semibold text-xl lg:text-2xl mb-6'>Lịch sử đơn hàng</h2>

                {/* Time Period Filter */}
                <div className='mb-6'>
                  <div className='flex flex-col space-y-2'>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='period'
                        value='last6months'
                        checked={selectedPeriod === 'last6months'}
                        onChange={(e) => setSelectedPeriod(e.target.value as any)}
                        className='mr-3 h-4 w-4 text-black border-gray-300 focus:ring-black accent-gray-950'
                      />
                      <span className='text-base lg:text-lg'>6 tháng gần đây</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='period'
                        value='lastyear'
                        checked={selectedPeriod === 'lastyear'}
                        onChange={(e) => setSelectedPeriod(e.target.value as any)}
                        className='mr-3 h-4 w-4 text-black border-gray-300 focus:ring-black accent-gray-950'
                      />
                      <span className='text-base lg:text-lg'>Năm ngoái</span>
                    </label>
                    <label className='flex items-center'>
                      <input
                        type='radio'
                        name='period'
                        value='alltime'
                        checked={selectedPeriod === 'alltime'}
                        onChange={(e) => setSelectedPeriod(e.target.value as any)}
                        className='mr-3 h-4 w-4 text-black border-gray-300 focus:ring-black accent-gray-950'
                      />
                      <span className='text-base lg:text-lg'>Tất cả</span>
                    </label>
                  </div>
                </div>

                {/* Orders List */}
                {isLoading ? (
                  <div className='flex justify-center py-12'>
                    <div className='text-base lg:text-lg text-gray-600'>Đang tải đơn hàng...</div>
                  </div>
                ) : error ? (
                  <div className='text-center py-12'>
                    <div className='text-base lg:text-lg text-red-600 mb-4'>
                      {error}
                    </div>
                    <Button
                      variant='outline'
                      className='border-gray-300 text-gray-700 hover:bg-gray-50'
                      onClick={() => window.location.reload()}
                    >
                      Thử lại
                    </Button>
                  </div>
                ) : orders.length === 0 ? (
                  <div className='text-center py-12'>
                    <div className='text-base lg:text-lg text-gray-600 mb-4'>
                      {pagination && pagination.totalCount > 0
                        ? 'Không có đơn hàng nào trong khoảng thời gian này.'
                        : 'Bạn chưa có đơn hàng nào để hiển thị.'}
                    </div>
                    <Button
                      className='bg-black text-white hover:bg-gray-800'
                      onClick={() => router.push(FRONTEND_PATH.products)}
                    >
                      Mua sắm ngay
                    </Button>
                  </div>
                ) : (
                  <div className='space-y-4 lg:space-y-6'>
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className='border border-gray-200 rounded-lg p-4 lg:p-6 bg-white shadow-sm'
                      >
                        {/* Order Header */}
                        <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 pb-4 border-b border-gray-100'>
                          <div className='mb-3 lg:mb-0'>
                            <h3 className='font-semibold text-base lg:text-lg text-black'>
                              {order.orderNumber}
                            </h3>
                            <p className='text-gray-600 mt-1 text-sm lg:text-base'>
                              Đặt ngày: {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className='flex justify-between lg:block lg:text-right'>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                getStatusDisplay(order.status).bgColor
                              } ${
                                getStatusDisplay(order.status).textColor
                              }`}
                            >
                              {getStatusDisplay(order.status).text}
                            </span>
                            <p className='text-base lg:text-lg font-semibold lg:mt-2'>
                              {formatPrice(order.totalVnd)}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className='space-y-3 mb-4'>
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className='flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-1 lg:space-y-0'
                            >
                              <div>
                                <h4 className='font-medium text-gray-900 text-sm lg:text-base'>
                                  {item.productName}
                                </h4>
                                <p className='text-gray-600 text-sm'>Số lượng: {item.quantity}</p>
                              </div>
                              <div className='lg:text-right'>
                                <p className='font-medium text-sm lg:text-base'>
                                  {formatPrice(item.unitPriceVnd)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className='flex flex-col lg:flex-row gap-2 lg:gap-3 pt-4 border-t border-gray-100'>
                          <Button
                            variant='outline'
                            className='border-gray-300 text-gray-700 hover:bg-gray-50 text-sm lg:text-base'
                            onClick={() => router.push(`${FRONTEND_PATH.orderDetail(order.orderNumber)}`)}
                          >
                            Xem chi tiết
                          </Button>
                          {order.status === OrderStatus.DELIVERED && (
                            <Button
                              variant='outline'
                              className='border-gray-300 text-gray-700 hover:bg-gray-50 text-sm lg:text-base'
                            >
                              Đánh giá sản phẩm
                            </Button>
                          )}
                          {(order.status === OrderStatus.DELIVERED || order.status === OrderStatus.SHIPPED) && (
                            <Button
                              variant='outline'
                              className='border-gray-300 text-gray-700 hover:bg-gray-50 text-sm lg:text-base'
                            >
                              Mua lại
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {!isLoading && !error && pagination &&
                 pagination.totalPages > 1 &&
                 pagination.currentPage < pagination.totalPages && (
                  <div className='text-center mt-8'>
                    <Button
                      variant='outline'
                      className='border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3'
                      onClick={handleLoadMore}
                      disabled={loadMoreLoading}
                    >
                      {loadMoreLoading ? 'Đang tải...' : 'Tải thêm đơn hàng'}
                    </Button>
                  </div>
                )}

                {/* Order Status Information */}
                {orders.length > 0 && (
                  <div className='mt-8 lg:mt-12 p-4 lg:p-6 bg-gray-50 rounded-lg'>
                    <h3 className='font-semibold text-base lg:text-lg mb-4'>Trạng thái đơn hàng</h3>
                    <div className='space-y-3 text-sm text-gray-700'>
                      <div>
                        <strong>Khi đơn hàng của bạn đã được xử lý</strong>, một email xác nhận đơn
                        hàng sẽ được gửi đến bạn có chứa số xác nhận đơn hàng. Hãy giữ số này để
                        theo dõi đơn hàng và xử lý trả hàng.
                      </div>
                      <div>
                        <strong>Xác nhận vận chuyển với số theo dõi</strong> sẽ được gửi qua email
                        khi đơn hàng của bạn rời khỏi kho hàng của chúng tôi.
                      </div>
                      <div>
                        <strong>Khi một đơn hàng đã được đặt và thanh toán</strong>, đơn hàng không
                        thể bị hủy. Nếu sản phẩm đủ điều kiện để trả hàng, bạn có thể liên hệ trả
                        hàng khi nhận được đơn hàng.
                      </div>
                      <div>
                        <strong>Thời gian xử lý và giao hàng ước tính với giao hàng nhanh</strong>{' '}
                        khoảng 3-5 ngày làm việc, tuy nhiên thời gian này có thể thay đổi tùy thuộc
                        vào đơn vị vận chuyển.
                      </div>
                    </div>
                  </div>
                )}

                {/* Help Section */}
                <div className='mt-8 lg:mt-12 p-4 lg:p-6 bg-white border border-gray-200 rounded-lg'>
                  <div className='flex items-start'>
                    <div className='flex-shrink-0'>
                      <div className='w-6 h-6 lg:w-8 lg:h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base'>
                        ?
                      </div>
                    </div>
                    <div className='ml-3 lg:ml-4'>
                      <h3 className='font-semibold text-base lg:text-lg mb-2'>
                        Không tìm thấy thông tin bạn đang tìm kiếm?
                      </h3>
                      <p className='text-gray-700 mb-4 text-sm lg:text-base'>
                        Vui lòng liên hệ với một trong những Đại diện Dịch vụ Khách hàng của chúng
                        tôi và chúng tôi sẽ giúp trả lời các câu hỏi của bạn.
                      </p>
                      <div className='space-y-2 text-sm'>
                        <div>
                          <strong>Giờ làm việc Dịch vụ Khách hàng</strong>
                        </div>
                        <div>
                          <strong>1900-1234</strong>
                        </div>
                        <div>
                          <strong>Việt Nam</strong>
                          <br />
                          Tiếng Việt: Thứ Hai đến Thứ Sáu 8am-6pm ICT
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
