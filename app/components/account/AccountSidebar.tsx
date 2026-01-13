'use client'

import { useAuthStore } from '@/app/store/auth-store'
import { useCartStore } from '@/app/store/cart-store'
import { FRONTEND_PATH } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface AccountSidebarProps {
  currentPage: 'profile' | 'edit-profile' | 'orders' | 'returns'
}

export function AccountSidebar({ currentPage }: AccountSidebarProps) {
  const signOut = useAuthStore((state) => state.signOut)
  const clearCart = useCartStore((state) => state.clearCart)
  const initializeCart = useCartStore((state) => state.initializeCart)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleSignOut = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      clearCart()
      await signOut()
      await initializeCart(true)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navigationItems = [
    {
      id: 'profile',
      label: 'Thông tin cá nhân',
      href: FRONTEND_PATH.viewProfile,
    },
    {
      id: 'orders',
      label: 'Đơn hàng',
      href: FRONTEND_PATH.orders,
    },
  ]

  const currentItem = navigationItems.find((item) => item.id === currentPage)

  return (
    <>
      {/* Desktop Sidebar */}
      <div className='hidden lg:block w-64 pr-8'>
        <ul className='space-y-6'>
          {navigationItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  'font-medium text-lg relative inline-block text-black after:absolute after:bottom-0 after:left-0 after:h-[1px]',
                  'after:w-0 after:bg-gray-900 after:transition-width after:duration-300 hover:after:w-full',
                  currentPage === item.id ? 'font-semibold text-black' : 'text-gray-700',
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              type='button'
              className='text-lg text-gray-700 hover:underline cursor-pointer w-full text-left font-normal'
              onClick={handleSignOut}
            >
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>

      {/* Mobile Dropdown */}
      <div className='lg:hidden relative'>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className='w-full flex items-center justify-between p-3 border border-gray-300 bg-white text-left focus:outline-none focus:ring-2 focus:ring-gray-500'
        >
          <span className='text-base font-medium'>{currentItem?.label || 'Chọn trang'}</span>
          {isDropdownOpen ? (
            <ChevronUp className='h-5 w-5 text-gray-500' />
          ) : (
            <ChevronDown className='h-5 w-5 text-gray-500' />
          )}
        </button>

        {isDropdownOpen && (
          <div className='absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 border-t-0 shadow-lg'>
            <ul className='py-2'>
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`block px-4 py-3 text-base hover:bg-gray-50 ${
                      currentPage === item.id
                        ? 'font-semibold text-black bg-gray-50'
                        : 'text-gray-700'
                    }`}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type='button'
                  className='block w-full text-left px-4 py-3 text-base text-gray-700 hover:bg-gray-50'
                  onClick={(e) => {
                    handleSignOut(e)
                    setIsDropdownOpen(false)
                  }}
                >
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
