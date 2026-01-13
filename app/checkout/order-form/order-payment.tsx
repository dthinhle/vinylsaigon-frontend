'use client'

import { CheckoutStep, IOrderForm } from '@/app/hooks/use-checkout'
import { PaymentMethodType } from '@/lib/types/order'
import OnePayLogo from '@/public/assets/onepay_logo.svg'
import { Banknote, Building2, Receipt } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type Props = {
  orderForm: IOrderForm
  checkoutStep: CheckoutStep
  updateOrderForm: (updates: Partial<IOrderForm>) => void
  onCheckout: () => Promise<void>
  isCreatingOrder: boolean
  clearOrderError: () => void
  subtotal: number
}

interface PaymentMethod {
  id: PaymentMethodType
  name: string
  description: string
  icon: React.ReactNode
}

const paymentMethods: PaymentMethod[] = [
  {
    id: PaymentMethodType.COD,
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: <Banknote className='size-8' />,
  },
  {
    id: PaymentMethodType.ONEPAY,
    name: 'Thanh toán OnePay',
    description: 'Thanh toán trực tuyến qua OnePay (Visa, MasterCard, ATM)',
    icon: <Image alt='onepay-logo' src={OnePayLogo} className='size-8' unoptimized />,
  },
  {
    id: PaymentMethodType.BANK_TRANSFER,
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản trực tiếp vào tài khoản ngân hàng của chúng tôi',
    icon: <Building2 className='size-8' />,
  },
  {
    id: PaymentMethodType.INSTALLMENT,
    name: 'Trả góp',
    description: 'Thanh toán trả góp linh hoạt cho hóa đơn từ 3.000.000đ',
    icon: <Receipt className='size-8' />,
  },
]

const BankTransferInfo: React.FC = () => {
  return (
    <div className='mt-4 p-4 bg-black-50 border border-black-200 rounded-lg'>
      <h4 className='font-semibold text-black-900 mb-3'>Thông tin tài khoản ngân hàng:</h4>
      <div className='space-y-2 text-sm'>
        <div className='flex justify-between'>
          <span className='text-black-700'>Tên ngân hàng:</span>
          <span className='font-medium text-black-900'>Vietcombank (TP.HCM)</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-black-700'>Số tài khoản:</span>
          <span className='font-medium text-black-900'>9932017292</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-black-700'>Chủ tài khoản:</span>
          <span className='font-medium text-black-900'>VO NGOC BAO NGAN</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-black-700'>Chi nhánh:</span>
          <span className='font-medium text-black-900'>TP. Hồ Chí Minh</span>
        </div>
      </div>
      <div className='mt-3 p-3 bg-atomic-tangerine-50 border border-atomic-tangerine-200 rounded'>
        <p className='text-sm text-atomic-tangerine-800'>
          <strong>Lưu ý:</strong> Vui lòng ghi rõ mã đơn hàng trong nội dung chuyển khoản. Đơn hàng
          sẽ được xử lý sau khi chúng tôi nhận được thanh toán.
        </p>
      </div>
    </div>
  )
}

const PaymentInfoDisplay: React.FC<{
  selectedPayment: string
  onEdit: () => void
}> = ({ selectedPayment, onEdit }) => {
  const paymentMethod = paymentMethods.find((method) => method.id === selectedPayment)

  if (!paymentMethod) return null

  return (
    <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
      <div className='flex justify-between items-start'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-700 mb-3'>Phương thức thanh toán:</p>
          <div className='flex items-center gap-3'>
            {paymentMethod.icon}
            <div>
              <p className='text-sm font-medium text-gray-900'>{paymentMethod.name}</p>
              <p className='text-sm text-gray-600'>{paymentMethod.description}</p>
            </div>
          </div>
        </div>
        <div className='ml-4'>
          <button
            type='button'
            onClick={onEdit}
            className='text-sm text-black-600 hover:text-black-800 underline font-medium'
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  )
}

const OrderPayment: React.FC<Props> = ({
  orderForm,
  checkoutStep,
  isCreatingOrder,
  subtotal,
  updateOrderForm,
  onCheckout,
  clearOrderError,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodType | null>(
    orderForm.payment_method || null,
  )
  const [isSubmitted, setIsSubmitted] = useState(false)
  const isActive = checkoutStep >= CheckoutStep.Payment

  const canInstallment = subtotal > 3_000_000
  const availablePaymentMethods = paymentMethods.filter((method) => {
    if (method.id === PaymentMethodType.INSTALLMENT) {
      return canInstallment
    }
    return true
  })

  const handlePaymentSelect = (paymentId: PaymentMethodType) => {
    setSelectedPayment(paymentId)
    updateOrderForm({ payment_method: paymentId })
    clearOrderError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPayment) return
    updateOrderForm({ payment_method: selectedPayment })
    setIsSubmitted(true)

    onCheckout()
  }

  const handleEdit = () => {
    setIsSubmitted(false)
    clearOrderError()
  }

  if (!isActive) {
    return (
      <div className='pt-4 border-t border-gray-300'>
        <div className='mb-6'>
          <div className='flex items-center gap-3 mb-4'>
            <span className='flex items-center justify-center size-8 rounded-full text-sm font-semibold bg-gray-300 text-gray-500'>
              3
            </span>
            <h2 className='text-xl font-semibold text-gray-500'>Thanh toán</h2>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='pt-4 border-t border-gray-300'>
      <div className='mb-6'>
        <div className='flex items-center gap-3 mb-4'>
          <span
            className={`flex items-center justify-center size-8 rounded-full text-sm font-semibold ${checkoutStep < CheckoutStep.Payment
                ? 'bg-gray-300 text-gray-500'
                : 'bg-black text-white'
              }`}
          >
            3
          </span>
          <h2
            className={`text-xl font-semibold ${checkoutStep < CheckoutStep.Payment ? 'text-gray-500' : 'text-gray-900'
              }`}
          >
            Thanh toán
          </h2>
        </div>
      </div>

      {checkoutStep === CheckoutStep.Payment && (
        <div className='lg:ml-[3rem]'>
          {isSubmitted ? (
            <PaymentInfoDisplay selectedPayment={selectedPayment!} onEdit={handleEdit} />
          ) : (
            <>
              <p className='text-base text-black mb-6 font-bold'>Chọn phương thức thanh toán:</p>
              <form className='space-y-6'>
                <div className='space-y-4'>
                  {availablePaymentMethods.map((method) => (
                    <div key={method.id}>
                      <label
                        className={`block p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${selectedPayment === method.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-300'
                          }`}
                      >
                        <div className='flex items-start gap-4'>
                          <input
                            type='radio'
                            name='payment'
                            value={method.id}
                            checked={selectedPayment === method.id}
                            onChange={() => handlePaymentSelect(method.id)}
                            className='mt-1 w-4 h-4 text-black border-gray-300 focus:ring-black accent-black'
                            disabled={isCreatingOrder}
                          />
                          <div className='flex items-start gap-3 flex-1'>
                            <div className='text-gray-600 mt-1'>{method.icon}</div>
                            <div className='flex-1'>
                              <h4 className='font-semibold text-gray-900 mb-1'>{method.name}</h4>
                              <p className='text-sm text-gray-600'>{method.description}</p>
                            </div>
                          </div>
                        </div>
                      </label>

                      {selectedPayment === method.id && method.id === 'bank_transfer' && (
                        <BankTransferInfo />
                      )}
                    </div>
                  ))}
                </div>
              </form>
            </>
          )}
          <div className='pt-8'>
            <button
              type='submit'
              disabled={isCreatingOrder || !selectedPayment}
              onClick={handleSubmit}
              className='bg-black text-white py-3 px-8 min-w-[210px] rounded-sm font-semibold text-sm hover:bg-gray-900 transition-colors disabled:bg-gray-500 flex items-center justify-center'
            >
              {isCreatingOrder ? (
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-500'></div>
              ) : (
                'Hoàn tất đơn hàng'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderPayment
