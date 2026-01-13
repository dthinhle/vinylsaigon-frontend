import { API_URL } from '@/lib/constants'
import * as React from 'react'

type Props = {
  params: { slug: string | string[] }
  searchParams?: Record<string, string | string[]>
}

function buildQuery(params: Record<string, string | string[]>) {
  const entries: string[] = []
  Object.keys(params).forEach((k) => {
    const v = params[k]
    if (v === undefined || v === null) return
    if (Array.isArray(v)) {
      v.forEach((val) => entries.push(`${encodeURIComponent(k)}=${encodeURIComponent(val)}`))
    } else {
      entries.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    }
  })
  return entries.length ? `?${entries.join('&')}` : ''
}

export default async function Head({ params, searchParams = {} }: Props) {
  const slugParam = params.slug
  const slugPath = Array.isArray(slugParam) ? slugParam.join('/') : slugParam
  const page =
    Number(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page) || 1
  const perPage =
    Number(
      Array.isArray(searchParams.per_page) ? searchParams.per_page[0] : searchParams.per_page,
    ) || 24

  const preservedParams: Record<string, string | string[]> = {}
  Object.keys(searchParams).forEach((k) => {
    if (k === 'page') return
    preservedParams[k] = searchParams[k] as string | string[]
  })

  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || ''}/danh-muc/${slugPath}`
  const links: JSX.Element[] = []

  if (page > 1) {
    const prevParams = { ...preservedParams, page: String(page - 1) }
    const prevHref = `${baseUrl}${buildQuery(prevParams)}`
    links.push(<link key='prev' rel='prev' href={prevHref} />)
  }

  try {
    const nextPage = page + 1
    const apiParams = new URLSearchParams()
    Object.keys(preservedParams).forEach((k) => {
      const v = preservedParams[k]
      if (Array.isArray(v)) {
        v.forEach((val) => apiParams.append(k, val))
      } else {
        apiParams.append(k, String(v))
      }
    })
    apiParams.set('category_slug', slugPath)
    apiParams.set('page', String(nextPage))
    apiParams.set('per_page', String(perPage))

    const res = await fetch(`${API_URL}/api/products?${apiParams.toString()}`, {
      cache: 'no-store',
    })
    if (res.ok) {
      const data = await res.json()
      const items = data?.products ?? data?.items ?? data?.data ?? []
      if (Array.isArray(items) && items.length > 0) {
        const nextParams = { ...preservedParams, page: String(nextPage) }
        const nextHref = `${baseUrl}${buildQuery(nextParams)}`
        links.push(<link key='next' rel='next' href={nextHref} />)
      }
    }
  } catch (_e) {
    // silent
  }

  return <>{links}</>
}
