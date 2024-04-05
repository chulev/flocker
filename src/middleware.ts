import { NextRequest } from 'next/server'

export default async function middleware(req: NextRequest) {
  const { redirectPath } = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/middleware?nextUrl=${req.nextUrl.pathname}`,
    {
      headers: { Cookie: req.cookies.toString() },
    }
  ).then((res) => res.json())

  if (redirectPath) {
    return Response.redirect(
      new URL(redirectPath, req.nextUrl as unknown as string)
    )
  }

  return null
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api)(.*)'],
}
