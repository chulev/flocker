'use server'

import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { publish } from '@/lib/store/client'
import { MAIN_CHANNEL_KEY } from '@/lib/validations'

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

      await publish(MAIN_CHANNEL_KEY, {
        type: 'REPLY_LIKE',
        data: { replyId, handle: currentUser.handle },
      })
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

      await publish(MAIN_CHANNEL_KEY, {
        type: 'REPLY_UNDO_LIKE',
        data: { replyId, handle: currentUser.handle },
      })
    }
  } catch (_) {
    throw Error(`Failed to ${isLiked ? 'like' : 'unlike'} reply`)
  }
}
