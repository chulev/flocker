import type { NextRequest } from 'next/server'

import { fetchPeople } from '@/data/user'
import { getCurrentUser } from '@/lib/auth'
import {
  LIMIT_SCHEMA,
  NEXT_CURSOR_SCHEMA,
  ORDER_SCHEMA,
} from '@/lib/validations'

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) return Response.json('Not authorized', { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const nextCursor = NEXT_CURSOR_SCHEMA.parse(searchParams.get('nextCursor'))
  const limit = LIMIT_SCHEMA.parse(searchParams.get('limit'))
  const order = ORDER_SCHEMA.parse(searchParams.get('order'))

  const response = await fetchPeople(nextCursor, limit, order)

  return Response.json(response)
}
