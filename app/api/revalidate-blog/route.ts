import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/security check
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.REVALIDATION_SECRET

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body
    let body: any
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Invalid JSON in request body',
          details: error instanceof Error ? error.message : 'Malformed JSON',
        },
        { status: 400 },
      )
    }

    // Ensure body is an object
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Request body must be a valid JSON object' },
        { status: 400 },
      )
    }

    const { slug, type = 'specific' } = body

    // Validate type parameter
    if (type !== undefined && typeof type !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid type parameter',
          details: 'Type must be a string',
        },
        { status: 400 },
      )
    }

    const validTypes = ['specific', 'all']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: 'Invalid type parameter',
          details: `Type must be one of: ${validTypes.join(', ')}. Received: ${type}`,
        },
        { status: 400 },
      )
    }

    if (type === 'all') {
      // Revalidate all blog-related pages
      console.log('Revalidating all blog pages')
      revalidateTag('blogs')
      revalidatePath('/tin-tuc')
      revalidatePath('/news')

      return NextResponse.json({
        message: 'All blog pages revalidated successfully',
        revalidatedAt: new Date().toISOString(),
        type: 'all',
      })
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required for specific blog revalidation' },
        { status: 400 },
      )
    }

    // Validate slug parameter type and format
    if (typeof slug !== 'string' || slug.trim() === '') {
      return NextResponse.json(
        {
          error: 'Invalid slug parameter',
          details: 'Slug must be a non-empty string',
        },
        { status: 400 },
      )
    }

    // Sanitize and validate slug format (URL-safe characters only)
    const sanitizedSlug = slug.trim()
    if (!/^[a-zA-Z0-9\-_]+$/.test(sanitizedSlug)) {
      return NextResponse.json(
        {
          error: 'Invalid slug format',
          details: 'Slug can only contain letters, numbers, hyphens, and underscores',
        },
        { status: 400 },
      )
    }

    // Revalidate specific blog post page
    console.log(`Revalidating blog post with slug: ${sanitizedSlug}`)
    revalidatePath(`/tin-tuc/${sanitizedSlug}`)
    revalidatePath(`/news/${sanitizedSlug}`)
    revalidateTag(`blog-${sanitizedSlug}`)

    return NextResponse.json({
      message: 'Blog post revalidated successfully',
      revalidatedAt: new Date().toISOString(),
      slug: sanitizedSlug,
      type: 'specific',
    })
  } catch (error) {
    console.error('Error revalidating blog:', error)

    return NextResponse.json(
      {
        error: 'Failed to revalidate blog cache',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

// Also allow GET for manual testing
export async function GET() {
  return NextResponse.json({
    message: 'Blog revalidation endpoint is working. Use POST to trigger revalidation.',
    endpoint: '/api/revalidate-blog',
    method: 'POST',
    headers: {
      Authorization: 'Bearer YOUR_REVALIDATION_SECRET (optional)',
    },
    body: {
      slug: 'blog-slug (required if type is "specific", optional if type is "all")',
      type: 'specific | all (default: specific)',
    },
  })
}
