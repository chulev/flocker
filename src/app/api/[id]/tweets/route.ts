import type { NextRequest } from 'next/server'

import {
  fetchUserLikedTweets,
  fetchUserMediaTweets,
  fetchUserRepliedTweets,
  fetchUserTweets,
} from '@/data/tweet'
import { getUserByHandle } from '@/data/user'
import { getCurrentUser } from '@/lib/auth'
import type { EnrichedTweet, PaginatedResponse } from '@/lib/types'
import {
  LIMIT_SCHEMA,
  NEXT_CURSOR_SCHEMA,
  ORDER_SCHEMA,
  USER_TWEETS_FILTERS_SCHEMA,
} from '@/lib/validations'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params

  const { id } = params

  const currentUser = await getCurrentUser()

  if (!currentUser) return Response.json('Not authorized', { status: 401 })

  const user = await getUserByHandle(id)

  if (!user) return Response.json('Not found', { status: 404 })

  const searchParams = request.nextUrl.searchParams
  const nextCursor = NEXT_CURSOR_SCHEMA.parse(searchParams.get('nextCursor'))
  const limit = LIMIT_SCHEMA.parse(searchParams.get('limit'))
  const order = ORDER_SCHEMA.parse(searchParams.get('order'))
  const filter = USER_TWEETS_FILTERS_SCHEMA.parse(searchParams.get('filter'))

  let response: PaginatedResponse<EnrichedTweet>

  switch (filter) {
    case 'tweets':
      response = await fetchUserTweets(id, nextCursor, limit, order)
      break
    case 'replies':
      response = await fetchUserRepliedTweets(id, nextCursor, limit, order)
      break
    case 'media':
      response = await fetchUserMediaTweets(id, nextCursor, limit, order)
      break
    case 'likes':
      response = await fetchUserLikedTweets(id, nextCursor, limit, order)
      break
  }

  return Response.json(response)
}
