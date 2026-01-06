import type { NextRequest } from 'next/server'

import { fetchTweetReplies } from '@/data/tweet'
import { getCurrentUser } from '@/lib/auth'
import {
  LIMIT_SCHEMA,
  NEXT_CURSOR_SCHEMA,
  ORDER_SCHEMA,
} from '@/lib/validations'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params

  const { id } = params

  const currentUser = await getCurrentUser()

  if (!currentUser) return Response.json('Not authorized', { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const nextCursor = NEXT_CURSOR_SCHEMA.parse(searchParams.get('nextCursor'))
  const limit = LIMIT_SCHEMA.parse(searchParams.get('limit'))
  const order = ORDER_SCHEMA.parse(searchParams.get('order'))

  const response = await fetchTweetReplies(
    id,
    currentUser.id,
    nextCursor,
    limit,
    order
  )

  return Response.json(response)
}
