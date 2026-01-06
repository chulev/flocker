import type { Kysely } from 'kysely'

import { filterUnique } from '@/lib/filter-unique'
import { findHashtags, getHashtag } from '@/lib/hashtag'

import { getRandomElement } from '../utils'

const tweets = [
  {
    content:
      'Life is like riding a bicycle. To keep your balance, you must keep moving. #life #balance',
  },
  {
    content:
      'The only way to do great work is to love what you do. #work #love',
  },
  {
    content:
      'Success is not final, failure is not fatal: It is the courage to continue that counts. #success #failure #courage',
  },
  {
    content:
      'Happiness is not something ready made. It comes from your own actions. #happiness #actions',
  },
  { content: "Believe you can and you're halfway there. #believe" },
  { content: 'The only impossible journey is the one you never begin.' },
  {
    content:
      'The best way to predict the future is to invent it. #future #invention',
  },
  {
    content:
      'The only limit to our realization of tomorrow will be our doubts of today. #limit #doubts',
  },
  {
    content:
      'Life is 10% what happens to us and 90% how we react to it. #life #reaction',
  },
  {
    content: 'It does not matter how slowly you go as long as you do not stop.',
  },
  {
    content:
      'A journey of a thousand miles begins with a single step. #journey #step',
  },
  {
    content:
      'The greatest glory in living lies not in never falling, but in rising every time we fall. #glory #rising',
  },
  {
    content:
      'In the middle of difficulty lies opportunity. #difficulty #opportunity',
  },
  {
    content:
      'The only source of knowledge is experience. #knowledge #experience',
  },
  {
    content:
      'All our dreams can come true, if we have the courage to pursue them. #dreams #courage',
  },
  {
    content:
      'Change your thoughts and you change your world. #thoughts #change',
  },
  {
    content:
      'The future belongs to those who believe in the beauty of their dreams. #future #dreams #beauty',
  },
  { content: 'Whatever you are, be a good one.' },
  { content: "Nothing is impossible, the word itself says 'I'm possible'!" },
  { content: "You miss 100% of the shots you don't take. #shots" },
  { content: 'The only way to do great work is to love what you do.' },
  { content: "Don't watch the clock; do what it does. Keep going." },
  { content: 'It always seems impossible until it is done. #impossible #done' },
  {
    content:
      "Whether you think you can or you think you can't, you're right. #mindset",
  },
  {
    content:
      'Strive not to be a success, but rather to be of value. #success #value',
  },
  {
    content:
      "I have not failed. I've just found 10,000 ways that won't work. #failure #learning",
  },
  {
    content:
      'The only person you are destined to become is the person you decide to be.',
  },
  {
    content:
      'What you get by achieving your goals is not as important as what you become by achieving your goals.',
  },
  { content: "Believe you can and you're halfway there. #believe" },
  {
    content:
      'I attribute my success to this: I never gave or took any excuse. #success #excuse',
  },
  {
    content:
      "Life is what happens to you while you're busy making other plans.",
  },
  {
    content:
      'The only limit to our realization of tomorrow will be our doubts of today. #limit #doubts',
  },
  {
    content:
      'Twenty years from now you will be more disappointed by the things that you didn’t do than by the ones you did do.',
  },
  {
    content: 'Do not let yesterday take up too much of today. #liveinthemoment',
  },
  {
    content:
      'You learn more from failure than from success. Don’t let it stop you. Failure builds character.',
  },
  {
    content: "It's not whether you get knocked down, it's whether you get up.",
  },
  {
    content:
      "If you are working on something that you really care about, you don't have to be pushed. The vision pulls you.",
  },
  {
    content:
      'People who are crazy enough to think they can change the world, are the ones who do.',
  },
  {
    content:
      'Failure will never overtake me if my determination to succeed is strong enough. #failure #determination',
  },
  {
    content:
      'Knowing is not enough; we must apply. Willing is not enough; we must do. #knowledge #action',
  },
  {
    content:
      'Imagine your life is perfect in every respect; what would it look like?',
  },
  { content: 'We may encounter many defeats but we must not be defeated.' },
  {
    content:
      'What you get by achieving your goals is not as important as what you become by achieving your goals.',
  },
]

export async function up(db: Kysely<any>): Promise<void> {
  const users = await db.selectFrom('User').select('id').execute()
  const userIds = users.map((user) => user.id)
  const createdTweets: { id: string; content: string }[] = []

  for (const tweet of tweets) {
    const createdTweet = await db
      .insertInto('Tweet')
      .values({
        ...tweet,
        userId: getRandomElement(userIds),
      })
      .returning(['id', 'content'])
      .executeTakeFirstOrThrow()

    createdTweets.push(createdTweet)
  }

  const retweets = createdTweets.slice(0, 10)
  const createdRetweets: { id: string; content: string }[] = []

  for (const [idx, retweet] of retweets.entries()) {
    const { id, ...retweetAttrs } = retweet
    const createdRetweet = await db
      .insertInto('Tweet')
      .values({
        ...retweetAttrs,
        userId: userIds[idx],
        retweetId: retweets[idx].id,
      })
      .returning(['id', 'content'])
      .executeTakeFirstOrThrow()

    createdRetweets.push(createdRetweet)
  }

  const createdTweetsWithHashtags = [...createdTweets, ...createdRetweets].map(
    (tweet) => ({
      ...tweet,
      hashtags: findHashtags(tweet.content).map((hashtag) => ({
        id: getHashtag(hashtag),
      })),
    })
  )

  const hashtags = await db
    .insertInto('Hashtag')
    .values(
      filterUnique(
        createdTweetsWithHashtags.flatMap((tweet) => tweet.hashtags)
      ).map((hashtag) => ({ value: hashtag.id }))
    )
    .returning(['id', 'value'])
    .execute()
  const hashtagMap = hashtags.reduce((acc: any, hashtag) => {
    acc[hashtag.value] = hashtag.id
    return acc
  }, {})

  await db
    .insertInto('TweetHashtag')
    .values(
      createdTweetsWithHashtags.flatMap((tweet) =>
        tweet.hashtags.map((hashtag) => ({
          tweetId: tweet.id,
          hashtagId: hashtagMap[hashtag.id],
        }))
      )
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('TweetHashtag').execute()
  await db.deleteFrom('Hashtag').execute()
  await db.deleteFrom('Tweet').execute()
}
