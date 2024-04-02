'use server'

import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { findHashtags, getHashtag } from '@/lib/hashtag'

export const retweet = async (tweetId: string, isRetweeted: boolean) => {
  try {
    const currentUser = await getCurrentUserOrThrow()
    const tweet = await db
      .selectFrom('Tweet')
      .leftJoin('TweetAttachment', 'TweetAttachment.tweetId', 'Tweet.id')
      .select([
        'Tweet.id',
        'Tweet.content',
        'Tweet.retweetId',
        'TweetAttachment.uri',
      ])
      .where('Tweet.id', '=', tweetId)
      .executeTakeFirstOrThrow()

    if (tweet.retweetId) throw Error('Cannot retweet a tweet')

    const retweetId = await db.transaction().execute(async (trx) => {
      const hashtags = findHashtags(tweet.content)

      if (isRetweeted) {
        const createdTweet = await trx
          .insertInto('Tweet')
          .values({
            userId: currentUser.id,
            retweetId: tweet.id,
            content: tweet.content,
          })
          .returning(['id'])
          .executeTakeFirstOrThrow()

        if (tweet.uri) {
          await trx
            .insertInto('TweetAttachment')
            .values({
              tweetId: createdTweet.id,
              uri: tweet.uri,
            })
            .executeTakeFirstOrThrow()
        }

        if (hashtags.length > 0) {
          const hashtagIds = await trx
            .insertInto('Hashtag')
            .values(
              hashtags.map((hashtag) => ({
                value: getHashtag(hashtag),
              }))
            )
            .onConflict((oc) =>
              oc
                .column('value')
                .doUpdateSet((eb) => ({ value: eb.ref('Hashtag.value') }))
            )
            .returning(['id'])
            .execute()

          await trx
            .insertInto('TweetHashtag')
            .values(
              hashtagIds.map(({ id: hashtagId }) => ({
                tweetId: createdTweet.id,
                hashtagId,
              }))
            )
            .execute()
        }

        return createdTweet.id
      } else {
        const retweet = await trx
          .selectFrom('Tweet')
          .leftJoin('Reply', 'Reply.tweetId', 'Tweet.id')
          .leftJoin('TweetLike', 'TweetLike.tweetId', 'Tweet.id')
          .leftJoin('Bookmark', 'Bookmark.tweetId', 'Tweet.id')
          .select((eb) => [
            'Tweet.id',
            'retweetId',
            eb.fn.count<number>('Reply.id').distinct().as('replyCount'),
            eb.fn.count<number>('TweetLike.id').distinct().as('likeCount'),
            eb.fn.count<number>('Bookmark.id').distinct().as('bookmarkCount'),
          ])
          .where((eb) =>
            eb.and([
              eb('Tweet.retweetId', '=', tweetId),
              eb('Tweet.userId', '=', currentUser.id),
            ])
          )
          .groupBy(['Tweet.id'])
          .executeTakeFirstOrThrow()

        if (!retweet?.id) throw Error('Cannot find retweet')

        if (retweet.replyCount > 0) {
          const retweetReplies = await trx
            .selectFrom('Reply')
            .select('id')
            .where('Reply.tweetId', '=', retweet.id)
            .execute()

          if (retweetReplies.length > 0) {
            await trx
              .deleteFrom('ReplyLike')
              .where(
                'ReplyLike.replyId',
                'in',
                retweetReplies.map((reply) => reply.id)
              )
              .execute()

            await trx
              .deleteFrom('ReplyAttachment')
              .where(
                'ReplyAttachment.replyId',
                'in',
                retweetReplies.map((reply) => reply.id)
              )
              .execute()
          }
        }

        if (retweet.bookmarkCount > 0) {
          await trx
            .deleteFrom('Bookmark')
            .where('Bookmark.tweetId', '=', retweet.id)
            .execute()
        }

        if (retweet.likeCount > 0) {
          await trx
            .deleteFrom('TweetLike')
            .where('TweetLike.tweetId', '=', retweet.id)
            .execute()
        }

        if (tweet.uri) {
          await trx
            .deleteFrom('TweetAttachment')
            .where('TweetAttachment.tweetId', '=', retweet.id)
            .execute()
        }

        if (hashtags.length > 0) {
          await trx
            .deleteFrom('TweetHashtag')
            .where('TweetHashtag.tweetId', '=', retweet.id)
            .execute()
        }

        const deletedRetweet = await trx
          .deleteFrom('Tweet')
          .where('Tweet.id', '=', retweet.id)
          .returning('id')
          .executeTakeFirst()

        if (!deletedRetweet?.id) throw Error('Could not delete retweet')

        return retweet.id
      }
    })
  } catch (err) {
    throw Error(`Failed to ${isRetweeted ? 'retweet' : 'delete retweet'}`)
  }
}
