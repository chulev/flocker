import { getCurrentUserOrThrow } from '@/lib/auth'
import { tweetsQuery, userReactionsQuery } from '@/lib/db/queries'
import { paginate } from '@/lib/paginate'
import type { CursorType, Order, ResultType, Tweet } from '@/lib/types'
import { extractDateFromUUID } from '@/lib/uuid'
import { DEFAULT_LIMIT } from '@/lib/validations'

const enrichTweets = async (
  tweets: Tweet[],
  currentUser: Awaited<ReturnType<typeof getCurrentUserOrThrow>>,
  limit: number = DEFAULT_LIMIT
) => {
  const tweetIds = tweets.map((tweet) => tweet.id)
  const reactions = await userReactionsQuery(tweetIds, currentUser.id).execute()
  const result = tweets.map((tweet) => {
    const tweetReactions = reactions.find(
      (reaction) => reaction.tweetId === tweet.id
    )

    return {
      ...tweet,
      date: extractDateFromUUID(tweet.id),
      reactions: {
        retweeted: !!tweetReactions?.retweeted,
        liked: !!tweetReactions?.liked,
        saved: !!tweetReactions?.saved,
      },
    }
  })

  return paginate<ResultType<typeof result>>(result, limit)
}

export const fetchTweet = async (id: string) => {
  const currentUser = await getCurrentUserOrThrow()
  const tweet = await tweetsQuery(null, 1, 'desc')
    .where('Tweet.id', '=', id)
    .executeTakeFirstOrThrow()
  const result = await enrichTweets([tweet], currentUser)

  return result.data[0]
}

export const fetchTopTweets = async (
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const tweets = await tweetsQuery(nextCursor, limit, order)
    .orderBy('likeCount', order)
    .execute()

  return enrichTweets(tweets, currentUser, limit)
}

export const fetchLatestTweets = async (
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const tweets = await tweetsQuery(nextCursor, limit, order)
    .orderBy('Tweet.id', order)
    .execute()

  return enrichTweets(tweets, currentUser, limit)
}

export const fetchMediaTweets = async (
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const tweets = await tweetsQuery(nextCursor, limit, order)
    .innerJoin(
      'TweetAttachment as UserTweetAttachment',
      'UserTweetAttachment.tweetId',
      'Tweet.id'
    )
    .orderBy('Tweet.id', order)
    .execute()

  return enrichTweets(tweets, currentUser, limit)
}

export const fetchBookmarkedTweets = async (
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const tweets = await tweetsQuery(nextCursor, limit, order)
    .innerJoin('Bookmark as UserBookmark', 'UserBookmark.tweetId', 'Tweet.id')
    .where('UserBookmark.userId', '=', currentUser.id)
    .orderBy('Tweet.id', order)
    .execute()

  return enrichTweets(tweets, currentUser, limit)
}
