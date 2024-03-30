'use server'

import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'

export const likeReply = async (replyId: string, isLiked: boolean) => {
  try {
    const currentUser = await getCurrentUserOrThrow()

    if (isLiked) {
      await db
        .insertInto('ReplyLike')
        .values({
          replyId,
          userId: currentUser.id,
        })
        .executeTakeFirstOrThrow()
    } else {
      const deletedLike = await db
        .deleteFrom('ReplyLike')
        .where((eb) =>
          eb.and([
            eb('replyId', '=', replyId),
            eb('userId', '=', currentUser.id),
          ])
        )
        .returning('id')
        .executeTakeFirst()

      if (!deletedLike?.id) throw Error('Could not delete like')
    }
  } catch (_) {
    throw Error(`Failed to ${isLiked ? 'like' : 'unlike'} reply`)
  }
}
