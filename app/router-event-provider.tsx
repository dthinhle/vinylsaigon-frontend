'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NProgress from 'nprogress'

const RouterInterceptor = () => {
  const router = useRouter()

  useEffect(() => {
    const originalPush = router.push
    const originalReplace = router.replace

    router.push = ((...args) => {
      NProgress.start()
      return originalPush(...args)
    }) as typeof router.push

    router.replace = ((...args) => {
      NProgress.start()
      return originalReplace(...args)
    }) as typeof router.replace

    return () => {
      router.push = originalPush
      router.replace = originalReplace
    }
  }, [router])

  return null
}

export default RouterInterceptor
