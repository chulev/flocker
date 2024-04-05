'use server'

import { fetchTweet } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { publish } from '@/lib/store/client'
import { MAIN_CHANNEL_KEY } from '@/lib/validations'

export const save = async (tweetId: string, isSaved: boolean) => {
  try {
    const currentUser = await getCurrentUserOrThrow()
    const tweet = await fetchTweet(tweetId)

    if (isSaved) {
      await db
        .insertInto('Bookmark')
        .values({
          userId: currentUser.id,
          tweetId: tweet.id,
        })
        .executeTakeFirstOrThrow()

      const savedTweet = await fetchTweet(tweet.id)

      await publish(MAIN_CHANNEL_KEY, {
        type: 'SAVE',
        data: { handle: currentUser.handle, tweet: savedTweet },
      })
    } else {
      const deletedSave = await db
        .deleteFrom('Bookmark')
        .where((eb) =>
          eb.and([
            eb('tweetId', '=', tweet.id),
            eb('userId', '=', currentUser.id),
          ])
        )
        .returning('id')
        .executeTakeFirst()

      if (!deletedSave?.id) throw Error('Could not delete save')

      await publish(MAIN_CHANNEL_KEY, {
        type: 'UNDO_SAVE',
        data: { tweetId, handle: currentUser.handle },
      })
    }
  } catch (_) {
    throw Error(`Failed to ${isSaved ? 'save' : 'delete saved'} tweet`)
  }
}
