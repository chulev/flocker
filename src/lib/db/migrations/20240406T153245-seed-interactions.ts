import { Kysely } from 'kysely'

import { getRandomElement, getRandomNumberInRange } from '../utils'

const replies = [
  'Great point! I completely agree.',
  "I respectfully disagree. Here's why...",
  'This is hilarious 😂',
  "Can't believe this is happening!",
  'Wow, never thought of it that way before.',
  "I'm with you 100% on this.",
  'Not sure I understand. Can you explain more?',
  'This deserves more attention.',
  'Absolutely spot on!',
  'I have a different perspective on this issue.',
  'This made my day!',
  "I can't stop laughing 😆",
  "You've articulated this issue perfectly.",
  "I'm not sure about this...",
  'This is so important. Thank you for sharing.',
  "Let's discuss this further.",
  "I couldn't agree more!",
  "I respectfully disagree. Here's my take...",
  'Incredible insight!',
  'This needs to go viral!',
  "I'm sorry, but I have to disagree.",
  'This hits close to home.',
  'This is a game-changer!',
  'Thank you for shedding light on this.',
  'This is pure gold!',
  "I'm speechless...",
  'This tweet made my day!',
  "I'm in awe of your perspective.",
  "Couldn't have said it better myself.",
  "I'm conflicted about this...",
]

export async function up(db: Kysely<any>): Promise<void> {
  const users = await db.selectFrom('User').select('id').execute()
  const userIds = users.map((user) => user.id)
  const tweets = await db.selectFrom('Tweet').select('id').execute()
  const tweetIds = tweets.map((tweet) => tweet.id)

  const createdReplies = await db
    .insertInto('Reply')
    .values(
      userIds.flatMap((userId, userIdx) =>
        [...Array(getRandomNumberInRange(1, 3))].map((_, interactionIdx) => ({
          userId,
          tweetId: tweetIds[(userIdx + interactionIdx) % tweetIds.length],
          content: getRandomElement(replies),
        }))
      )
    )
    .returning('id')
    .execute()

  await db
    .insertInto('ReplyLike')
    .values(
      userIds.flatMap((userId, userIdx) =>
        [...Array(getRandomNumberInRange(1, 3))].map((_, interactionIdx) => ({
          userId,
          replyId: createdReplies.map((reply) => reply.id)[
            (userIdx + interactionIdx) % createdReplies.length
          ],
        }))
      )
    )
    .execute()

  await db
    .insertInto('TweetLike')
    .values(
      userIds.flatMap((userId, userIdx) =>
        [...Array(getRandomNumberInRange(1, 3))].map((_, interactionIdx) => ({
          userId,
          tweetId: tweetIds[(userIdx + interactionIdx) % tweetIds.length],
        }))
      )
    )
    .execute()

  await db
    .insertInto('Bookmark')
    .values(
      userIds.flatMap((userId, userIdx) =>
        [...Array(getRandomNumberInRange(1, 3))].map((_, interactionIdx) => ({
          userId,
          tweetId: tweetIds[(userIdx + interactionIdx) % tweetIds.length],
        }))
      )
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('Bookmark').execute()
  await db.deleteFrom('TweetLike').execute()
  await db.deleteFrom('ReplyLike').execute()
  await db.deleteFrom('Reply').execute()
}
