import { TweetList } from '@/components/tweet/list'
import { fetchUserTweets } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

type Props = {
  params: {
    handle: string
  }
}

export default async function UserTweetsPage({ params: { handle } }: Props) {
  const currentUser = await getCurrentUserOrThrow()
  const initialTweets = await fetchUserTweets(handle)

  return (
    <TweetList<LoaderType<typeof fetchUserTweets>>
      route={`/api/${handle}/tweets/?filter=tweets`}
      currentUser={currentUser}
      initialTweets={initialTweets}
    />
  )
}
