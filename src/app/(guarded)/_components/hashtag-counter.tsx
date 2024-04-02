'use client'

import { useState } from 'react'

import { Count } from '@/components/count'

type Props = {
  hashtag: string
  tweetCount: string
}

export const HashtagCounter = ({ hashtag, tweetCount }: Props) => {
  const [hashtagCount, setHashtagCount] = useState(tweetCount)

  return <Count count={hashtagCount} singular='tweet' plural='tweets' />
}
