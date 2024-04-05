'use client'

import { useState } from 'react'

import { Count } from '@/components/count'
import { useSSE } from '@/hooks/use-sse'
import { findHashtags } from '@/lib/hashtag'

type Props = {
  hashtag: string
  tweetCount: string
}

export const HashtagCounter = ({ hashtag, tweetCount }: Props) => {
  const [hashtagCount, setHashtagCount] = useState(tweetCount)

  useSSE({
    TWEET: (tweet) => {
      const hashtags = findHashtags(tweet.content)

      if (hashtags.length > 0 && hashtags.includes(`#${hashtag}`))
        setHashtagCount(`${parseInt(hashtagCount, 10) + 1}`)
    },
    RETWEET: (retweet) => {
      const hashtags = findHashtags(retweet.content)

      if (hashtags.length > 0 && hashtags.includes(`#${hashtag}`))
        setHashtagCount(`${parseInt(hashtagCount, 10) + 1}`)
    },
    UNDO_RETWEET: (retweet) => {
      if (retweet.hashtags) {
        const hashtags = findHashtags(retweet.hashtags)

        if (hashtags.includes(`#${hashtag}`))
          setHashtagCount(`${parseInt(hashtagCount, 10) - 1}`)
      }
    },
  })

  return <Count count={hashtagCount} singular='tweet' plural='tweets' />
}
