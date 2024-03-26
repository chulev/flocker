import { Metadata } from 'next/types'

import { TweetList } from '@/components/tweet/list'
import { fetchUserRepliedTweets } from '@/data/tweet'
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
    title: `${handle} Replies | Flocker`,
    description: 'Be social',
  }
}

export default async function UserRepliesPage({ params: { handle } }: Props) {
  const currentUser = await getCurrentUserOrThrow()
  const initialTweets = await fetchUserRepliedTweets(handle)

  return (
    <TweetList<LoaderType<typeof fetchUserRepliedTweets>>
      route={`/api/${handle}/tweets/?filter=replies`}
      currentUser={currentUser}
      initialTweets={initialTweets}
    />
  )
}
