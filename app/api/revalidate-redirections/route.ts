import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// TODO: WIP - This revalidation endpoint is not fully tested yet
export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/security check
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.REVALIDATION_SECRET

    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Revalidate the redirections data using the same tag as middleware
    revalidateTag('redirections')

    return NextResponse.json({
      message: 'Redirections cache revalidated successfully',
      revalidatedAt: new Date().toISOString(),
      tag: 'redirections',
    })
  } catch (error) {
    console.error('Error revalidating redirections:', error)

    return NextResponse.json(
      {
        error: 'Failed to revalidate redirections cache',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

// TODO: WIP - This revalidation endpoint is not fully tested yet
// Also allow GET for manual testing
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation endpoint is working. Use POST to trigger revalidation.',
    endpoint: '/api/revalidate-redirections',
    method: 'POST',
    headers: {
      Authorization: 'Bearer YOUR_REVALIDATION_SECRET (optional)',
    },
    tag: 'redirections',
  })
}
