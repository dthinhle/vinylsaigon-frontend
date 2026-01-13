import { useCallback, useEffect, useRef, useState } from 'react'

interface ScrollState {
  scrollDir: 'up' | 'down' | null
  scrollPosition: { top: number } | null
}

export const useThrottledScroll = (threshold = 20, throttleMs = 100): ScrollState => {
  const [scrollDir, setScrollDir] = useState<'up' | 'down' | null>(null)
  const [scrollPosition, setScrollPosition] = useState<{ top: number } | null>(null)
  const lastScrollY = useRef(0)
  const lastScrollTime = useRef(0)

  const handleScroll = useCallback(() => {
    const currentTime = Date.now()
    if (currentTime - lastScrollTime.current < throttleMs) {
      return
    }

    const currentScrollY = window.scrollY
    const scrollDifference = Math.abs(currentScrollY - lastScrollY.current)

    if (scrollDifference >= threshold) {
      const newScrollDir = currentScrollY > lastScrollY.current ? 'down' : 'up'
      setScrollDir(newScrollDir)
      setScrollPosition({ top: currentScrollY })
      lastScrollY.current = currentScrollY
      lastScrollTime.current = currentTime
    }
  }, [threshold, throttleMs])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return { scrollDir, scrollPosition }
}
