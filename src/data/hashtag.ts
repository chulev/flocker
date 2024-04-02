import { db } from '@/lib/db/client'
import type { Order } from '@/lib/types'
import { HASHTAG_LIMIT } from '@/lib/validations'

export const fetchTrendingHashtags = async (
  limit: number = HASHTAG_LIMIT,
  order: Order = 'desc'
) => {
  return await db
    .selectFrom('Hashtag')
    .leftJoin('TweetHashtag', 'TweetHashtag.hashtagId', 'Hashtag.id')
    .select((eb) => [
      'Hashtag.value',
      eb.fn.count<string>('TweetHashtag.id').distinct().as('tweetCount'),
    ])
    .groupBy(['Hashtag.id'])
    .orderBy('tweetCount', order)
    .limit(limit)
    .execute()
}
