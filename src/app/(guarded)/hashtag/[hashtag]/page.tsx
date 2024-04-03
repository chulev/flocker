import { Metadata } from 'next/types'

import { Divider } from '@/components/divider'
import { TweetList } from '@/components/tweet/list'
import { fetchTweetsByHashtag } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

type Props = {
  params: {
    hashtag: string
  }
}

export async function generateMetadata({
  params: { hashtag },
}: Props): Promise<Metadata> {
  return {
    title: `Tweets for #${hashtag} | Flocker`,
    description: 'Be social',
  }
}

export default async function HashtagPage({ params: { hashtag } }: Props) {
  const currentUser = await getCurrentUserOrThrow()
  const decodedHashtag = decodeURI(hashtag)
  const initialTweets = await fetchTweetsByHashtag(decodedHashtag)

  return (
    <div className='grid'>
      <div className='flex items-center text-sm text-charcoal'>
        Tweets for #{decodedHashtag}
      </div>
      <Divider />
      <TweetList<LoaderType<typeof fetchTweetsByHashtag>>
        initialTweets={initialTweets}
        route={`/api/tweets/${hashtag}?f=1`}
        currentUser={currentUser}
      />
    </div>
  )
}
