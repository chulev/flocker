import type { Metadata } from 'next/types'

import { TweetList } from '@/components/tweet/list'
import { fetchBookmarkedTweets } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Bookmarks | Flocker',
  description: 'Be social',
}

export default async function BookmarksPage() {
  const currentUser = await getCurrentUserOrThrow()
  const initialTweets = await fetchBookmarkedTweets()

  return (
    <TweetList<LoaderType<typeof fetchBookmarkedTweets>>
      route='/api/tweets/?filter=bookmarks'
      currentUser={currentUser}
      initialTweets={initialTweets}
    />
  )
}
