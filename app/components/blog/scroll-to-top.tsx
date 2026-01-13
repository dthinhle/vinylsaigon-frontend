'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [showScroll, setShowScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!showScroll) return null

  return (
    <button
      onClick={scrollToTop}
      className='cursor-pointer fixed right-6 bottom-8 z-50 bg-black text-white rounded-full shadow-lg p-4 hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center'
      aria-label='Scroll to top'
    >
      <ArrowUp className='size-8' color='white' />
    </button>
  )
}
