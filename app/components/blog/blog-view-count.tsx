'use client'

import { API_URL } from '@/lib/constants'
import { useEffect, useState } from 'react'

export default function BlogViewCount({
  slug,
  initialCount,
}: {
  slug: string
  initialCount: number
}) {
  const [viewCount, setViewCount] = useState(initialCount)

  useEffect(() => {
    // Function to update view count
    const updateViewCount = async () => {
      try {
        const res = await fetch(`${API_URL}/api/blogs/${slug}/view_count`, {
          method: 'POST', // This will increment the view count
          cache: 'no-store', // Disable caching for this request
        })

        if (!res.ok) {
          setViewCount(initialCount)
          return
        }

        const data = await res.json()
        setViewCount(data.view_count)
      } catch (error) {
        console.error('Failed to fetch updated view count:', error)
        setViewCount(initialCount)
      }
    }

    // Update view count when component mounts
    const sessionKey = `viewed-${slug}`
    if (typeof window !== 'undefined' && !sessionStorage.getItem(sessionKey)) {
      updateViewCount()
      sessionStorage.setItem(sessionKey, 'true')
    }
  }, [initialCount, slug])

  return <>{viewCount} lượt xem</>
}
