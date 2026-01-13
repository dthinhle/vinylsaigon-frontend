'use client'

import { StoreAddress } from '@/app/store/shop-store'
import { PhoneCallIcon } from 'lucide-react'

export const StorePickupForm: React.FC<{
  selectedStore: number | string | undefined
  stores: StoreAddress[]
  onStoreSelect: (storeId: number | string) => void
}> = ({ selectedStore, stores, onStoreSelect }) => {
  return (
    <div className='space-y-4'>
      <p className='text-base text-black mb-6 font-bold'>Chọn cửa hàng để nhận hàng:</p>
      {stores.map((store, index) => (
        <label
          key={store.id}
          className={`block p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
            selectedStore === store.id.toString() ? 'border-black bg-gray-50' : 'border-gray-300'
          }`}
        >
          <div className='flex items-start gap-3'>
            <input
              type='radio'
              name='store'
              value={store.id}
              checked={selectedStore === store.id}
              onChange={() => onStoreSelect(store.id)}
              className='mt-1 w-4 h-4 text-black border-gray-300 focus:ring-black accent-black'
            />
            <div className='flex-1'>
              <h4 className='font-semibold text-gray-900'>
                {store.name || `Cửa hàng ${index + 1}`}
              </h4>
              <p className='text-sm text-gray-700 mt-1'>
                {store.address}, {store.ward}
              </p>
              <p className='text-sm text-gray-700'>
                {store.district}, {store.city}
              </p>
              <div className='flex items-center gap-1 mt-2'>
                <PhoneCallIcon className='size-4' />
                <span className='text-sm text-gray-700'>{store.phoneNumbers.join(' - ')}</span>
              </div>
            </div>
          </div>
        </label>
      ))}
    </div>
  )
}
