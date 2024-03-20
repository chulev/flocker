'use server'

import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { formDataToValues } from '@/lib/serialize'
import { TWEET_SCHEMA } from '@/lib/validations'

export const post = async (data: FormData) => {
  const deserializedValues = formDataToValues(data)
  const parsedValues = TWEET_SCHEMA.parse(deserializedValues)
  const currentUser = await getCurrentUserOrThrow()

  const tweetId = await db.transaction().execute(async (trx) => {
    const tweet = await trx
      .insertInto('Tweet')
      .values({
        userId: currentUser.id,
        content: parsedValues.content,
        followerOnly: parsedValues.followerOnly === 'Y',
      })
      .returning(['id'])
      .executeTakeFirstOrThrow()

    return tweet.id
  })
}
