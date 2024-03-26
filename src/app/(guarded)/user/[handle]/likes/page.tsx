import { Metadata } from 'next/types'

import { TweetList } from '@/components/tweet/list'
import { fetchUserLikedTweets } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

type Props = {
  params: {
    handle: string
  }
}

export async function generateMetadata({
  params: { handle },
}: Props): Promise<Metadata> {
  return {
    title: `${handle} Likes | Flocker`,
    description: 'Be social',
  }
}

export default async function UserLikesPage({ params: { handle } }: Props) {
  const currentUser = await getCurrentUserOrThrow()
  const initialTweets = await fetchUserLikedTweets(handle)

  return (
    <TweetList<LoaderType<typeof fetchUserLikedTweets>>
      route={`/api/${handle}/tweets/?filter=likes`}
      currentUser={currentUser}
      initialTweets={initialTweets}
    />
  )
}
