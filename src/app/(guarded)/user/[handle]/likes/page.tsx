import { Metadata } from 'next/types'

import { TweetList } from '@/components/tweet/list'
import { fetchUserLikedTweets } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

type Props = {
  params: Promise<{
    handle: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  const { handle } = params

  return {
    title: `${handle} Likes | Flocker`,
    description: 'Be social',
  }
}

export default async function UserLikesPage(props: Props) {
  const params = await props.params

  const { handle } = params

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
