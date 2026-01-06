import type { Metadata } from 'next/types'

import { TweetList } from '@/components/tweet/list'
import { fetchUserRepliedTweets } from '@/data/tweet'
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
    title: `${handle} Replies | Flocker`,
    description: 'Be social',
  }
}

export default async function UserRepliesPage(props: Props) {
  const params = await props.params

  const { handle } = params

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
