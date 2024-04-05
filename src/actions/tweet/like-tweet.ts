'use server'

import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { publish } from '@/lib/store/client'
import { MAIN_CHANNEL_KEY } from '@/lib/validations'

export const like = async (tweetId: string, isLiked: boolean) => {
  try {
    const currentUser = await getCurrentUserOrThrow()

    if (isLiked) {
      await db
        .insertInto('TweetLike')
        .values({
          userId: currentUser.id,
          tweetId,
        })
        .executeTakeFirstOrThrow()

      await publish(MAIN_CHANNEL_KEY, {
        type: 'TWEET_LIKE',
        data: { tweetId, handle: currentUser.handle },
      })
    } else {
      const deletedLike = await db
        .deleteFrom('TweetLike')
        .where((eb) =>
          eb.and([
            eb('tweetId', '=', tweetId),
            eb('userId', '=', currentUser.id),
          ])
        )
        .returning('id')
        .executeTakeFirst()

      if (!deletedLike?.id) throw Error('Could not delete like')

      await publish(MAIN_CHANNEL_KEY, {
        type: 'TWEET_UNDO_LIKE',
        data: { tweetId, handle: currentUser.handle },
      })
    }
  } catch (_) {
    throw Error(`Failed to ${isLiked ? 'like' : 'unlike'} tweet`)
  }
}
