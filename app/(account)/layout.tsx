'use client'

import { ProtectedRoute } from '@/app/components/auth'

export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className='min-h-screen w-full antialiased relative auth-disable-scroll' >
        {children}
      </div>
    </ProtectedRoute>
  )
}
