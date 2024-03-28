import type { CursorType, Order } from '../types'
import { DEFAULT_LIMIT } from '../validations'
import { db } from './client'

export const userReactionsQuery = (tweetIds: string[], userId: string) => {
  let reactionsQuery = db
    .selectFrom('Tweet')
    .leftJoin('Tweet as Retweet', (join) =>
      join
        .onRef('Retweet.retweetId', '=', 'Tweet.id')
        .on('Retweet.userId', '=', userId)
    )
    .leftJoin('TweetLike', (join) =>
      join
        .onRef('TweetLike.tweetId', '=', 'Tweet.id')
        .on('TweetLike.userId', '=', userId)
    )
    .leftJoin('Bookmark', (join) =>
      join
        .onRef('Bookmark.tweetId', '=', 'Tweet.id')
        .on('Bookmark.userId', '=', userId)
    )
    .select((eb) => [
      eb
        .case()
        .when(eb.ref('Retweet.id'), 'is not', null)
        .then(true)
        .else(false)
        .end()
        .as('retweeted'),
      eb
        .case()
        .when(eb.ref('TweetLike.id'), 'is not', null)
        .then(true)
        .else(false)
        .end()
        .as('liked'),
      eb
        .case()
        .when(eb.ref('Bookmark.id'), 'is not', null)
        .then(true)
        .else(false)
        .end()
        .as('saved'),
      'Tweet.id as tweetId',
    ])

  if (tweetIds.length > 0) {
    reactionsQuery = reactionsQuery.where('Tweet.id', 'in', tweetIds)
  }

  return reactionsQuery
}

export const tweetsQuery = (
  nextCursor: CursorType,
  limit: number,
  order: Order
) => {
  let tweetsBaseQuery = db
    .selectFrom('Tweet')
    .innerJoin('User', 'User.id', 'Tweet.userId')
    .leftJoin('Tweet as Retweet', 'Tweet.retweetId', 'Retweet.id')
    .leftJoin('User as OriginalUser', 'Retweet.userId', 'OriginalUser.id')
    .leftJoin('Tweet as RetweetCount', 'Tweet.id', 'RetweetCount.retweetId')
    .leftJoin('TweetAttachment', 'TweetAttachment.tweetId', 'Tweet.id')
    .leftJoin('Reply', 'Reply.tweetId', 'Tweet.id')
    .leftJoin('TweetLike', 'TweetLike.tweetId', 'Tweet.id')
    .leftJoin('Bookmark', 'Bookmark.tweetId', 'Tweet.id')
    .select((eb) => [
      eb
        .case()
        .when(eb.ref('OriginalUser.name'), 'is', null)
        .then(eb.ref('User.name'))
        .else(eb.ref('OriginalUser.name'))
        .end()
        .as('userName'),
      eb
        .case()
        .when(eb.ref('OriginalUser.image'), 'is', null)
        .then(eb.ref('User.image'))
        .else(eb.ref('OriginalUser.image'))
        .end()
        .as('userImage'),
      eb
        .case()
        .when(eb.ref('OriginalUser.handle'), 'is', null)
        .then(eb.ref('User.handle'))
        .else(eb.ref('OriginalUser.handle'))
        .end()
        .as('userHandle'),
      eb
        .case()
        .when(eb.ref('OriginalUser.name'), 'is not', null)
        .then(eb.ref('User.name'))
        .else(null)
        .end()
        .as('retweeterName'),
      eb
        .case()
        .when(eb.ref('OriginalUser.handle'), 'is not', null)
        .then(eb.ref('User.handle'))
        .else(null)
        .end()
        .as('retweeterHandle'),
      'Tweet.id',
      'Tweet.content',
      'Tweet.followerOnly',
      'Retweet.id as retweetId',
      'TweetAttachment.uri as imgPath',
      eb.fn.count<string>('Reply.id').distinct().as('replyCount'),
      eb.fn.count<string>('RetweetCount.id').distinct().as('retweetCount'),
      eb.fn.count<string>('TweetLike.id').distinct().as('likeCount'),
      eb.fn.count<string>('Bookmark.id').distinct().as('bookmarkCount'),
    ])
    .groupBy([
      'Tweet.id',
      'User.id',
      'OriginalUser.id',
      'TweetAttachment.id',
      'Retweet.id',
    ])

  if (nextCursor) {
    const sign = order === 'asc' ? '>=' : '<='
    tweetsBaseQuery = tweetsBaseQuery.where('Tweet.id', sign, nextCursor)
  }

  return tweetsBaseQuery.limit(limit + 1)
}

export const peopleQuery = (
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc',
  currentUserId: string,
  emailVerified: boolean = true
) => {
  let peopleQuery = db
    .selectFrom('User')
    .leftJoin('Follow', 'Follow.followeeId', 'User.id')
    .leftJoin('Follow as CurrentUserFollowsUser', (join) =>
      join
        .on('CurrentUserFollowsUser.followerId', '=', currentUserId)
        .onRef('CurrentUserFollowsUser.followeeId', '=', 'User.id')
    )
    .select((eb) => [
      'User.id',
      'User.name',
      'User.handle',
      'User.image',
      'User.description',
      eb
        .case()
        .when(eb.ref('CurrentUserFollowsUser.id'), 'is not', null)
        .then(true)
        .else(false)
        .end()
        .as('following'),
      eb.fn.count<string>('Follow.id').distinct().as('followersCount'),
    ])
    .groupBy(['User.id', 'CurrentUserFollowsUser.id'])

  if (emailVerified) {
    peopleQuery = peopleQuery.where('User.emailVerified', 'is not', null)
  }

  if (nextCursor) {
    const sign = order === 'asc' ? '>=' : '<='
    peopleQuery = peopleQuery.where('User.id', sign, nextCursor)
  }

  return peopleQuery.limit(limit + 1)
}
