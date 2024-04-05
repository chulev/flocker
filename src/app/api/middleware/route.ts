import { auth, fetchUser } from '@/lib/auth'
import {
  API_AUTH_PREFIX,
  AUTH_ROUTES,
  HOME_PATH,
  RESET_PASSWORD_ROUTE_PREFIX,
  SIGN_IN_PATH,
  VERIFY_ROUTE_PREFIX,
} from '@/routes'

export const GET = auth(async (req) => {
  const { searchParams } = new URL(req.url)
  const nextUrl = searchParams.get('nextUrl') as string
  const isAuthenticated = await fetchUser()

  const isApiAuthRoute = nextUrl.startsWith(API_AUTH_PREFIX)
  const isAuthRoute =
    AUTH_ROUTES.includes(nextUrl) ||
    nextUrl.startsWith(VERIFY_ROUTE_PREFIX) ||
    nextUrl.startsWith(RESET_PASSWORD_ROUTE_PREFIX)

  if (isApiAuthRoute) {
    return Response.json({ redirectPath: null })
  }

  if (isAuthRoute && isAuthenticated) {
    return Response.json({ redirectPath: HOME_PATH })
  }

  if (!isAuthenticated && !isAuthRoute) {
    return Response.json({ redirectPath: SIGN_IN_PATH })
  }

  return Response.json({ redirectPath: null })
}) as any
