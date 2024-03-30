import { getCurrentUserOrThrow } from '@/lib/auth'
import {
  repliesQuery,
  tweetRepliesQuery,
  tweetsQuery,
  userReactionsQuery,
} from '@/lib/db/queries'
import { paginate } from '@/lib/paginate'
import type { CursorType, Order, ResultType, Tweet } from '@/lib/types'
import { extractDateFromUUID } from '@/lib/uuid'
import { DEFAULT_LIMIT, REPLY_LIMIT } from '@/lib/validations'

import { getUserByHandle } from './user'

const enrichTweets = async (
  tweets: Tweet[],
  currentUser: Awaited<ReturnType<typeof getCurrentUserOrThrow>>,
  limit: number = DEFAULT_LIMIT
) => {
  const tweetIds = tweets.map((tweet) => tweet.id)
  const replies = await tweetRepliesQuery(tweetIds, currentUser.id).execute()
  const reactions = await userReactionsQuery(tweetIds, currentUser.id).execute()
  const result = tweets.map((tweet) => {
    const tweetReactions = reactions.find(
      (reaction) => reaction.tweetId === tweet.id
    )
    const tweetReplies = replies
      .filter((reply) => reply.tweetId === tweet.id)
      .map((reply) => ({
        ...reply,
        date: extractDateFromUUID(reply.id),
      }))

    return {
      ...tweet,
      date: extractDateFromUUID(tweet.id),
      replies: paginate<ResultType<typeof tweetReplies>>(
        tweetReplies,
        REPLY_LIMIT
      ),
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
  const tweet = await tweetsQuery(null, 1, 'desc', currentUser.id)
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
  const tweets = await tweetsQuery(nextCursor, limit, order, currentUser.id)
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
  const tweets = await tweetsQuery(nextCursor, limit, order, currentUser.id)
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
  const tweets = await tweetsQuery(nextCursor, limit, order, currentUser.id)
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
  const tweets = await tweetsQuery(nextCursor, limit, order, currentUser.id)
    .innerJoin('Bookmark as UserBookmark', 'UserBookmark.tweetId', 'Tweet.id')
    .where('UserBookmark.userId', '=', currentUser.id)
    .orderBy('Tweet.id', order)
    .execute()

  return enrichTweets(tweets, currentUser, limit)
}

export const fetchUserTweets = async (
  handle: string,
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const user = await getUserByHandle(handle)

  if (!user) throw Error('User not found')

  const tweets = await tweetsQuery(nextCursor, limit, order, currentUser.id)
    .where('Tweet.userId', '=', user.id)
    .orderBy('Tweet.id', order)
    .execute()

  return enrichTweets(tweets, currentUser, limit)
}

export const fetchUserRepliedTweets = async (
  handle: string,
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const user = await getUserByHandle(handle)

  if (!user) throw Error('User not found')

  const tweets = await tweetsQuery(nextCursor, limit, order, currentUser.id)
    .innerJoin('Reply as UserReply', 'UserReply.tweetId', 'Tweet.id')
    .where('UserReply.userId', '=', user.id)
    .orderBy('Tweet.id', order)
    .execute()

  return enrichTweets(tweets, currentUser, limit)
}

export const fetchUserMediaTweets = async (
  handle: string,
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const user = await getUserByHandle(handle)

  if (!user) throw Error('User not found')

  const tweets = await tweetsQuery(nextCursor, limit, order, currentUser.id)
    .innerJoin(
      'TweetAttachment as UserTweetAttachment',
      'UserTweetAttachment.tweetId',
      'Tweet.id'
    )
    .where('Tweet.userId', '=', user.id)
    .orderBy('Tweet.id', order)
    .execute()

  return enrichTweets(tweets, currentUser, limit)
}

export const fetchUserLikedTweets = async (
  handle: string,
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const user = await getUserByHandle(handle)

  if (!user) throw Error('User not found')

  const tweets = await tweetsQuery(nextCursor, limit, order, currentUser.id)
    .innerJoin(
      'TweetLike as UserTweetLike',
      'UserTweetLike.tweetId',
      'Tweet.id'
    )
    .where('UserTweetLike.userId', '=', user.id)
    .orderBy('Tweet.id', order)
    .execute()

  return enrichTweets(tweets, currentUser, limit)
}

export const fetchTweetReplies = async (
  tweetId: string,
  currentUserId: string,
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const tweetReplies = await repliesQuery(
    tweetId,
    currentUserId,
    nextCursor,
    limit,
    order
  )
    .where('Reply.tweetId', '=', tweetId)
    .orderBy('Reply.id', order)
    .limit(limit + 1)
    .execute()
  const result = tweetReplies.map((reply) => ({
    ...reply,
    date: extractDateFromUUID(reply.id),
  }))

  return paginate<ResultType<typeof result>>(result, limit)
}
