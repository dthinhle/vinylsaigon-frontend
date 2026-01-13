import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { recaptchaResponse } = await request.json()
  const secretKey = process.env.RECAPTCHA_SECRET

  const validateResponse = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`,
    {
      method: 'POST',
    },
  )
  const data = await validateResponse.json()

  if (data.success) {
    return NextResponse.json(
      { success: true },
      { status: 200 },
    )
  } else {
    return NextResponse.json(
      { success: false },
      { status: 400 },
    )
  }
}
