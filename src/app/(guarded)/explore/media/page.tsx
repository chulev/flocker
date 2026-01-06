import type { Metadata } from 'next/types'

import { TweetList } from '@/components/tweet/list'
import { fetchMediaTweets } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Media | Flocker',
  description: 'Be social',
}

export default async function MediaPage() {
  const currentUser = await getCurrentUserOrThrow()
  const initialTweets = await fetchMediaTweets()

  return (
    <TweetList<LoaderType<typeof fetchMediaTweets>>
      initialTweets={initialTweets}
      route='/api/tweets?filter=media'
      currentUser={currentUser}
    />
  )
}
