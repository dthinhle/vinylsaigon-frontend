'use client'

import { PublicRoute } from '@/app/components/auth'
import bgImage from '@/public/assets/auth-bg.jpg'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <PublicRoute>
      <style jsx global>{`
        header,
        footer {
          display: none;
        }
      `}</style>

      {/* Background image */}
      <div className='fixed inset-0'>
        <Image
          src={bgImage}
          alt='3K Shop'
          fill
          style={{ objectFit: 'cover' }}
          priority
          unoptimized
        />
        <div className='absolute inset-0 bg-black/30' />
      </div>
      {/* Auth form container, high z-index to be above menu/footer */}
      <div className='relative flex items-center justify-center min-h-screen w-full'>
        {children}
      </div>
    </PublicRoute>
  )
}
