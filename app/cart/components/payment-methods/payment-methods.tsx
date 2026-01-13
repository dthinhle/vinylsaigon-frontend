import Image from 'next/image'
import * as React from 'react'

const STATIC_PAYMENT_METHODS = [
  {
    id: 'pm-apple',
    type: 'apple_pay',
    label: 'Apple Pay',
    icon: '/payment-methods/apple-pay.svg',
    alt: 'Apple Pay logo',
  },
  {
    id: 'pm-google',
    type: 'google_pay',
    label: 'Google Pay',
    icon: '/payment-methods/google-pay.svg',
    alt: 'Google Pay logo',
  },
  {
    id: 'pm-master',
    type: 'mastercard',
    label: 'Mastercard',
    icon: '/payment-methods/master.svg',
    alt: 'Mastercard logo',
  },
  {
    id: 'pm-visa',
    type: 'visa',
    label: 'Visa',
    icon: '/payment-methods/visa.svg',
    alt: 'Visa logo',
  },
]

export const PaymentMethods: React.FC = () => {
  return (
    <section className='mt-6' aria-label='Phương thức thanh toán'>
      <h3 className='text-right mb-3 text-gray-900'>Phương thức thanh toán</h3>
      <ul className='flex justify-end-safe gap-3' aria-label='Phương thức thanh toán'>
        {STATIC_PAYMENT_METHODS.map((method) => (
          <li key={method.id} className='flex flex-col items-center gap-2 select-none'>
            <Image
              src={method.icon}
              alt={method.alt}
              width={49}
              height={49}
              style={{ display: 'block' }}
              unoptimized
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
