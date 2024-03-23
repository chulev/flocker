import { Metadata } from 'next/types'

import { TweetList } from '@/components/tweet/list'
import { fetchLatestTweets } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Latest | Flocker',
  description: 'Be social',
}

export default async function LatestPage() {
  const currentUser = await getCurrentUserOrThrow()
  const initialTweets = await fetchLatestTweets()

  return (
    <TweetList<LoaderType<typeof fetchLatestTweets>>
      initialTweets={initialTweets}
      route='/api/tweets?filter=latest'
      currentUser={currentUser}
    />
  )
}
