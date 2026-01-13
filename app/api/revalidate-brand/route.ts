import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.REVALIDATION_SECRET

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: any
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { slug, categorySlug } = body

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Revalidate brand page
    // Filesystem path: app/brands/[slug]/page.tsx
    revalidatePath(`/brands/${slug}`)

    if (categorySlug) {
      // Revalidate brand category page
      // Filesystem path: app/brands/[slug]/[categorySlug]/page.tsx
      revalidatePath(`/brands/${slug}/${categorySlug}`)
    }

    return NextResponse.json({
      revalidated: true,
      brand: slug,
      category: categorySlug || 'all',
      revalidatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to revalidate brand',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Brand revalidation endpoint. Use POST with { "slug": "brand-slug", "categorySlug": "optional-category-slug" }',
  })
}
