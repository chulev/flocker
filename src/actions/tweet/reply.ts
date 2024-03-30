'use server'

import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { formDataToValues } from '@/lib/serialize'
import { REPLY_SCHEMA } from '@/lib/validations'

import { upload } from '../upload'

export const reply = async (tweetId: string, data: FormData) => {
  const deserializedValues = formDataToValues(data)
  const parsedValues = REPLY_SCHEMA.parse(deserializedValues)
  const currentUser = await getCurrentUserOrThrow()

  const replyId = await db.transaction().execute(async (trx) => {
    if (parsedValues.followerOnly === 'Y') {
      const tweet = await trx
        .selectFrom('Tweet')
        .select(['Tweet.userId', 'Tweet.followerOnly'])
        .where('Tweet.id', '=', tweetId)
        .executeTakeFirstOrThrow()

      if (tweet.followerOnly) {
        const isPosterFollowing = await trx
          .selectFrom('Follow')
          .select(['Follow.id'])
          .where((eb) =>
            eb.and([
              eb('Follow.followerId', '=', tweet.userId),
              eb('Follow.followeeId', '=', currentUser.id),
            ])
          )
          .executeTakeFirst()

        if (!isPosterFollowing?.id)
          throw Error('Tweet poster not following user')
      }
    }

    const reply = await trx
      .insertInto('Reply')
      .values({
        userId: currentUser.id,
        tweetId: tweetId,
        content: parsedValues.content,
      })
      .returning(['id'])
      .executeTakeFirstOrThrow()

    if (parsedValues.img instanceof File) {
      const imgPath = await upload(parsedValues.img)

      if (imgPath) {
        await trx
          .insertInto('ReplyAttachment')
          .values({
            replyId: reply.id,
            uri: imgPath,
          })
          .executeTakeFirstOrThrow()
      }
    }

    return reply.id
  })
}
