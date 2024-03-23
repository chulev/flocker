'use server'

import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'

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
    }
  } catch (_) {
    throw Error(`Failed to ${isLiked ? 'like' : 'unlike'} tweet`)
  }
}
