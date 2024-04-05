'use server'

import { fetchTweet } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { findHashtags, getHashtag } from '@/lib/hashtag'
import { formDataToValues } from '@/lib/serialize'
import { publish } from '@/lib/store/client'
import { MAIN_CHANNEL_KEY, TWEET_SCHEMA } from '@/lib/validations'

import { upload } from '../upload'

export const post = async (data: FormData) => {
  const deserializedValues = formDataToValues(data)
  const parsedValues = TWEET_SCHEMA.parse(deserializedValues)
  const currentUser = await getCurrentUserOrThrow()
  const hashtags = findHashtags(parsedValues.content)

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
            tweetId: tweet.id,
            hashtagId,
          }))
        )
        .execute()
    }

    if (parsedValues.img instanceof File) {
      const imgPath = await upload(parsedValues.img)

      if (imgPath) {
        await trx
          .insertInto('TweetAttachment')
          .values({
            tweetId: tweet.id,
            uri: imgPath,
          })
          .executeTakeFirstOrThrow()
      }
    }

    return tweet.id
  })

  const createdTweet = await fetchTweet(tweetId)

  await publish(MAIN_CHANNEL_KEY, {
    type: 'TWEET',
    data: createdTweet,
  })
}
