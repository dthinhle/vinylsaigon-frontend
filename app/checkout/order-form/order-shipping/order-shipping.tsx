'use client'

import { CheckoutStep, IOrderForm } from '@/app/hooks/use-checkout'
import { StoreAddress, useShopStore } from '@/app/store/shop-store'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { IAddress } from '@/lib/types/order'
import { CheckIcon } from '@radix-ui/react-icons'
import { CircleQuestionMark, StoreIcon, Truck } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { OrderAddressForm } from './order-address-form'
import { StorePickupForm } from './store-pickup-form'

type Props = {
  defaultName: string
  defaultPhoneNumber: string
  checkoutStep: CheckoutStep
  updateOrderShipping: (
    shipping_method: string,
    phone_number: string,
    name?: string,
    shipping_address?: IAddress,
    store_address_id?: number | string,
  ) => void
  updateOrderForm: (updates: Partial<IOrderForm>) => void
}

interface ShippingForm {
  fullname: string
  address: string
  ward: string
  city: string
  postalCode: string
  isPoBox: boolean
  phone: string
}

const initialForm: ShippingForm = {
  fullname: '',
  address: '',
  ward: '',
  city: '',
  postalCode: '',
  isPoBox: false,
  phone: '',
}

// Shipping Info Display Component
const ShippingInfoDisplay: React.FC<{
  activeTab: 'address' | 'pickup'
  stores: StoreAddress[]
  form: ShippingForm
  selectedStore: number | string | undefined
  onEdit: () => void
}> = ({ activeTab, stores, form, selectedStore, onEdit }) => {
  const selectedStoreData = stores.find((store) => store.id === selectedStore)

  return (
    <div className='flex justify-between items-start gap-4'>
      <div className='flex flex-col lg:flex-row gap-4'>
        <p className='text-base font-semibold text-black'>
          {activeTab === 'address' ? 'Giao hàng tới:' : 'Nhận tại cửa hàng:'}
        </p>
        <div className='flex-1'>
          <div className='space-y-1'>
            {activeTab === 'address' ? (
              <>
                <p className='text-base text-black'>{form.fullname}</p>
                <p className='text-base text-black'>
                  {form.address}, {form.ward}, {form.city}
                </p>
                {form.postalCode && <p className='text-base text-black'>{form.postalCode}</p>}
                <p className='text-base text-black'>{form.phone}</p>
              </>
            ) : selectedStoreData ? (
              <>
                <p className='text-base text-black'>
                  {selectedStoreData.name || `Cửa hàng ${selectedStoreData.id}`}
                </p>
                <p className='text-base text-black'>{selectedStoreData.address}</p>
                <p className='text-base text-black'>{selectedStoreData.ward}</p>
                <p className='text-base text-black'>
                  {selectedStoreData.district}, {selectedStoreData.city}
                </p>
                <p className='text-base text-black'>{selectedStoreData.phoneNumbers.join(' - ')}</p>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className='ml-4'>
        <button
          type='button'
          onClick={onEdit}
          className='min-w-18 text-black font-semibold text-sm hover:text-gray-700 underline underline-offset-2 transition-colors cursor-pointer'
        >
          Chỉnh sửa
        </button>
      </div>
    </div>
  )
}

const OrderShipping: React.FC<Props> = ({
  checkoutStep,
  defaultName,
  defaultPhoneNumber,
  updateOrderShipping,
  updateOrderForm,
}) => {
  const [activeTab, setActiveTab] = useState<'address' | 'pickup'>('address')
  const [form, setForm] = useState<ShippingForm>(initialForm)
  const [selectedStore, setSelectedStore] = useState<number | string | undefined>(undefined)
  const [errors, setErrors] = useState<Partial<ShippingForm>>({})
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const store = useShopStore((state) => state.store)
  const stores = store?.addresses || []

  const updateField = useCallback(
    (field: keyof ShippingForm, value: string | boolean) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors],
  )

  useEffect(() => {
    if (defaultName && !form.fullname) {
      updateField('fullname', defaultName)
    }

    if (defaultPhoneNumber && !form.phone) {
      updateField('phone', defaultPhoneNumber)
    }
  }, [defaultName, defaultPhoneNumber, form.fullname, form.phone, updateField])

  useEffect(() => {
    if (isSubmitted && checkoutStep < CheckoutStep.Shipping) {
      setIsSubmitted(false)
    }
  }, [isSubmitted, checkoutStep])

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingForm> = {}
    if (!form.phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc'

    if (activeTab === 'pickup') {
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0 && !!selectedStore
    }

    if (!form.fullname.trim()) newErrors.fullname = 'Họ và Tên là bắt buộc'
    if (!form.address.trim()) newErrors.address = 'Địa chỉ là bắt buộc'
    if (!form.ward.trim()) newErrors.ward = 'Phường/Xã là bắt buộc'
    if (!form.city) newErrors.city = 'Tỉnh/thành phố là bắt buộc'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)
      if (activeTab === 'address') {
        const address = {
          address: form.address,
          ward: form.ward,
          city: form.city,
          phoneNumbers: [form.phone],
        }
        updateOrderShipping('ship_to_address', form.phone, form.fullname, address)
      } else {
        updateOrderShipping('pick_up_at_store', form.phone, form.fullname, undefined, selectedStore)
      }
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error saving shipping info:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTab = (tab: 'address' | 'pickup') => {
    setActiveTab(tab)
    setIsSubmitted(false)
  }

  const onEdit = () => {
    updateOrderForm({ checkoutStep: CheckoutStep.Shipping })
    setIsSubmitted(false)
  }

  return (
    <div className='pt-4 border-t border-gray-300 pb-8'>
      <div className='xl:mb-6'>
        <div className='flex items-center gap-3 xl:mb-4'>
          <span
            className={`flex items-center justify-center size-8 rounded-full text-sm font-semibold ${checkoutStep < CheckoutStep.Shipping ? 'bg-gray-300 text-gray-500' : 'bg-black text-white'}`}
          >
            {isSubmitted ? <CheckIcon className='size-5 text-white font-bold' /> : <span>2</span>}
          </span>
          <h2
            className={`text-xl font-semibold ${checkoutStep < CheckoutStep.Shipping ? 'text-gray-500' : 'text-gray-900'}`}
          >
            Giao hàng
          </h2>
        </div>
      </div>

      {checkoutStep >= CheckoutStep.Shipping && (
        <div className='lg:ml-[3rem]'>
          {checkoutStep == CheckoutStep.Shipping && (
            <div className='mb-6'>
              <ul role='tablist' className='flex border-b border-gray-200 cursor-pointer'>
                <li role='tab' className='flex-1'>
                  <button
                    type='button'
                    className={`w-full flex items-center justify-center gap-3 px-4 py-3 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gray-500 ${
                      activeTab === 'address'
                        ? 'after:duration-300 text-black after:transition-width after:bg-gray-900 after:w-full'
                        : 'after:duration-0 border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => toggleTab('address')}
                  >
                    <Truck />
                    <span className='font-medium'>Giao hàng tận nơi</span>
                  </button>
                </li>
                <li role='tab' className='flex-1'>
                  <button
                    type='button'
                    className={`w-full flex items-center justify-center gap-3 px-4 py-3 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gray-500 ${
                      activeTab === 'pickup'
                        ? 'after:duration-300 text-black after:transition-width after:bg-gray-900 after:w-full'
                        : 'after:duration-0 border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => toggleTab('pickup')}
                  >
                    <StoreIcon />
                    <span className='font-medium'>Nhận tại cửa hàng</span>
                  </button>
                </li>
              </ul>
            </div>
          )}

          {isSubmitted ? (
            <ShippingInfoDisplay
              form={form}
              stores={stores}
              activeTab={activeTab}
              selectedStore={selectedStore}
              onEdit={onEdit}
            />
          ) : (
            <form onSubmit={handleSubmit} className='space-y-6'>
              {activeTab === 'address' ? (
                <OrderAddressForm form={form} errors={errors} updateField={updateField} />
              ) : (
                <StorePickupForm
                  stores={stores}
                  selectedStore={selectedStore}
                  onStoreSelect={setSelectedStore}
                />
              )}

              <div>
                <div className='flex items-center gap-1 mb-2'>
                  <label htmlFor='phone' className='block text-sm font-semibold text-gray-700'>
                    <span className='text-red-500'>*</span> Số điện thoại:
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span tabIndex={0} role='button' aria-label='Thông tin về mã đơn hàng'>
                        <CircleQuestionMark className='size-4 hover:text-gray-700 transition-colors' />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      side='right'
                      className='max-w-[280px] text-pretty'
                      style={
                        {
                          '--foreground': 'var(--color-gray-950)',
                          '--background': 'white',
                        } as React.CSSProperties
                      }
                    >
                      Số điện thoại chỉ được sử dụng để liên lạc về đơn hàng của bạn.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  id='phone'
                  type='tel'
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder='Nhập số điện thoại'
                  className={`w-full px-3 py-3 border rounded-md text-sm transition-colors focus:outline-none focus:ring-0 ${
                    errors.phone
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-atomic-tangerine-200'
                  }`}
                />
                {errors.phone && <p className='mt-1 text-sm text-red-600'>{errors.phone}</p>}
              </div>

              <div className='pt-4'>
                <button
                  type='submit'
                  disabled={loading || (activeTab === 'pickup' && !selectedStore)}
                  className='bg-black text-white py-3 px-8 min-w-[210px] rounded-sm font-semibold text-sm hover:bg-gray-900 transition-colors disabled:bg-gray-500 flex items-center justify-center cursor-pointer'
                >
                  {loading ? (
                    <div className='animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-500'></div>
                  ) : (
                    'Tiếp tục'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default OrderShipping
