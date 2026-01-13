import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST() {
  revalidateTag('menu-config')
  revalidateTag('landing-page')
  revalidateTag('global-data')
  revalidateTag('search-suggestions')

  return NextResponse.json({ revalidated: true })
}
