import { NextRequest } from 'next/server'

import { fetchLatestTweets } from '@/data/tweet'
import { getCurrentUser } from '@/lib/auth'
import type { EnrichedTweet, PaginatedResponse } from '@/lib/types'
import {
  LIMIT_SCHEMA,
  NEXT_CURSOR_SCHEMA,
  ORDER_SCHEMA,
  TWEETS_FILTERS_SCHEMA,
} from '@/lib/validations'

export async function GET(request: NextRequest) {
  const currentUser = await getCurrentUser()

  if (!currentUser) return Response.json('Not authorized', { status: 401 })

  const searchParams = request.nextUrl.searchParams
  const nextCursor = NEXT_CURSOR_SCHEMA.parse(searchParams.get('nextCursor'))
  const limit = LIMIT_SCHEMA.parse(searchParams.get('limit'))
  const order = ORDER_SCHEMA.parse(searchParams.get('order'))
  const filter = TWEETS_FILTERS_SCHEMA.parse(searchParams.get('filter'))

  let response: PaginatedResponse<EnrichedTweet>

  switch (filter) {
    case 'latest':
      response = await fetchLatestTweets(nextCursor, limit, order)
      break
    default:
      response = await fetchLatestTweets(nextCursor, limit, order)
      break
  }

  return Response.json(response)
}
