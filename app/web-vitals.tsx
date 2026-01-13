'use client'

import { useReportWebVitals } from 'next/web-vitals'

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    va?: (...args: any[]) => void
  }
}

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    console.log(metric)

    // Option 1: Google Analytics (if available)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        metric_id: metric.id,
        metric_value: metric.value,
        metric_delta: metric.delta,
      })
    }

    // Option 2: Custom endpoint for tracking Core Web Vitals
    // Uncomment and configure as needed for your analytics endpoint
    /*
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        body: JSON.stringify(metric),
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch((error) => {
        console.error('Failed to send web vital metric:', error)
      })
    }
    */

    // Option 3: Send to a third-party analytics service like Vercel Analytics
    // Uncomment and configure as needed
    /*
    if (typeof window !== 'undefined' && window.va) {
      window.va('event', {
        name: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
      })
    }
    */
  })

  return null
}
