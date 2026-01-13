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

    // Revalidate collection page
    // Filesystem path: app/collections/[slug]/page.tsx
    revalidatePath(`/collections/${slug}`)

    if (categorySlug) {
      // Revalidate collection category page
      // Filesystem path: app/collections/[slug]/[categorySlug]/page.tsx
      revalidatePath(`/collections/${slug}/${categorySlug}`)
    }

    return NextResponse.json({
      revalidated: true,
      collection: slug,
      category: categorySlug || 'all',
      revalidatedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to revalidate collection',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Collection revalidation endpoint. Use POST with { "slug": "collection-slug", "categorySlug": "optional-category-slug" }',
  })
}
