import { TweetList } from '@/components/tweet/list'
import { fetchUserTweets } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

type Props = {
  params: Promise<{
    handle: string
  }>
}

export default async function UserTweetsPage(props: Props) {
  const params = await props.params

  const { handle } = params

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
