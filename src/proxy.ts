import { NextRequest, NextResponse } from 'next/server'

import rateLimit from './lib/rate-limit'
import { SIGN_IN_PATH, SIGN_OUT_PATH } from './routes'

export default async function proxy(req: NextRequest) {
  const { redirectPath } = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/middleware?nextUrl=${req.nextUrl.pathname}`,
    {
      headers: { Cookie: req.cookies.toString() },
    }
  ).then((res) => res.json())

  if (
    req.method === 'POST' &&
    ![SIGN_IN_PATH, SIGN_OUT_PATH].includes(req.nextUrl.pathname)
  ) {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0] ??
      req.headers.get('x-real-ip') ??
      'unknown'

    return rateLimit(ip ?? 'unknown')
      ? Response.json(
          `Sorry, you've reached the limit of requests allowed within this timeframe`,
          { status: 429 }
        )
      : NextResponse.next()
  }

  if (redirectPath) {
    return Response.redirect(
      new URL(redirectPath, req.nextUrl as unknown as string)
    )
  }

  return null
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next).*)'],
}
