import { Metadata } from 'next/types'

import { TweetList } from '@/components/tweet/list'
import { fetchUserMediaTweets } from '@/data/tweet'
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
    title: `${handle} Media | Flocker`,
    description: 'Be social',
  }
}

export default async function UserMediaPage({ params: { handle } }: Props) {
  const currentUser = await getCurrentUserOrThrow()
  const initialTweets = await fetchUserMediaTweets(handle)

  return (
    <TweetList<LoaderType<typeof fetchUserMediaTweets>>
      route={`/api/${handle}/tweets/?filter=media`}
      currentUser={currentUser}
      initialTweets={initialTweets}
    />
  )
}
