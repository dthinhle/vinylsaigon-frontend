'use client'

import { vietnamProvinces } from '@/lib/constants'

interface ShippingForm {
  fullname: string
  address: string
  ward: string
  city: string
  postalCode: string
  isPoBox: boolean
  phone: string
}

export const OrderAddressForm: React.FC<{
  form: ShippingForm
  errors: Partial<ShippingForm>
  updateField: (field: keyof ShippingForm, value: string | boolean) => void
}> = ({ form, errors, updateField }) => {
  return (
    <div className='space-y-6'>
      <p className='text-base text-black mb-6 font-bold'>Thông tin giao hàng:</p>
      <div>
        <label htmlFor='fullname' className='block text-sm font-semibold text-gray-700 mb-2'>
          <span className='text-red-500'>*</span> Họ và Tên:
        </label>
        <input
          id='fullname'
          type='text'
          value={form.fullname}
          onChange={(e) => updateField('fullname', e.target.value)}
          placeholder='Nhập tên của bạn'
          className={`w-full px-3 py-3 border rounded-md text-sm transition-colors focus:outline-none focus:ring-0 ${
            errors.fullname ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        />
        {errors.fullname && <p className='mt-1 text-sm text-red-600'>{errors.fullname}</p>}
      </div>
      <div>
        <label htmlFor='address' className='block text-sm font-semibold text-gray-700 mb-2'>
          <span className='text-red-500'>*</span> Địa chỉ:
        </label>
        <input
          id='address'
          type='text'
          value={form.address}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder='Nhập địa chỉ của bạn'
          className={`w-full px-3 py-3 border rounded-md text-sm transition-colors focus:outline-none focus:ring-0 ${
            errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        />
        {errors.address && <p className='mt-1 text-sm text-red-600'>{errors.address}</p>}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label htmlFor='ward' className='block text-sm font-semibold text-gray-700 mb-2'>
            <span className='text-red-500'>*</span> Phường/Xã:
          </label>
          <input
            id='ward'
            type='text'
            value={form.ward}
            onChange={(e) => updateField('ward', e.target.value)}
            placeholder='Nhập Phường/Xã'
            className={`w-full px-3 py-3 border rounded-md text-sm transition-colors focus:outline-none focus:ring-0 ${
              errors.ward ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.ward && <p className='mt-1 text-sm text-red-600'>{errors.ward}</p>}
        </div>

        <div>
          <label htmlFor='city' className='block text-sm font-semibold text-gray-700 mb-2'>
            <span className='text-red-500'>*</span> Tỉnh/Thành phố:
          </label>
          <select
            id='city'
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
            className={`w-full px-3 py-3 border rounded-md text-sm focus:outline-none focus:ring-0 ${
              errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {vietnamProvinces.map((province) => (
              <option key={province} value={province} disabled={!province}>
                {province}
              </option>
            ))}
          </select>
          {errors.city && <p className='mt-1 text-sm text-red-600'>{errors.city}</p>}
        </div>

        <div>
          <label htmlFor='postalCode' className='block text-sm font-semibold text-gray-700 mb-2'>
            Mã bưu điện:
          </label>
          <input
            id='postalCode'
            type='text'
            value={form.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value)}
            placeholder='Nhập mã bưu điện'
            className={`w-full px-3 py-3 border rounded-md text-sm transition-colors focus:outline-none focus:ring-0 ${
              errors.postalCode
                ? 'border-red-500 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          />
          {errors.postalCode && <p className='mt-1 text-sm text-red-600'>{errors.postalCode}</p>}
        </div>
      </div>
    </div>
  )
}
