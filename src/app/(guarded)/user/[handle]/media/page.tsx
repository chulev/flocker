import { Metadata } from 'next/types'

import { TweetList } from '@/components/tweet/list'
import { fetchUserMediaTweets } from '@/data/tweet'
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
    title: `${handle} Media | Flocker`,
    description: 'Be social',
  }
}

export default async function UserMediaPage(props: Props) {
  const params = await props.params

  const { handle } = params

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
