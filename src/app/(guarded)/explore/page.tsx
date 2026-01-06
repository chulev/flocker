import type { Metadata } from 'next/types'

import { TweetList } from '@/components/tweet/list'
import { fetchTopTweets } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Top | Flocker',
  description: 'Be social',
}

export default async function TopPage() {
  const currentUser = await getCurrentUserOrThrow()
  const initialTweets = await fetchTopTweets()

  return (
    <TweetList<LoaderType<typeof fetchTopTweets>>
      initialTweets={initialTweets}
      route='/api/tweets?filter=top'
      currentUser={currentUser}
      manual
    />
  )
}
