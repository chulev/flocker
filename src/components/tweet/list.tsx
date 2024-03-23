'use client'

import BinocularsIcon from 'public/binoculars.svg'

import { useInfiniteLoader } from '@/hooks/use-infinite-loader'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { EnrichedTweet, PaginatedResponse } from '@/lib/types'

import { Tweet } from '.'
import { Button } from '../button'
import { TweetSkeleton } from './skeleton'

type Props<T> = {
  route: string
  limit?: number
  manual?: boolean
  currentUser: Awaited<ReturnType<typeof getCurrentUserOrThrow>>
  initialTweets: PaginatedResponse<T>
}

export const TweetList = <T extends EnrichedTweet>({
  route,
  limit,
  manual,
  currentUser,
  initialTweets,
}: Props<T>) => {
  const {
    data: tweets,
    isLoading,
    isError,
    hasMore,
    sentryRef,
    fetchMore,
  } = useInfiniteLoader<T>({
    initialData: initialTweets,
    route,
    limit,
    manual,
  })

  return (
    <section className='grid gap-3'>
      {tweets.map((tweet, idx) => (
        <Tweet key={tweet.id} currentUser={currentUser} {...tweet} />
      ))}
      {hasMore && !manual && <div ref={sentryRef} />}
      {isLoading && <TweetSkeleton count={5} />}
      {isError && (
        <div className='flex flex-col items-center justify-center text-sm text-ashen'>
          An error has occured
          <Button className='mt-1' onClick={() => fetchMore()}>
            Retry
          </Button>
        </div>
      )}
      {tweets.length === 0 && (
        <div className='flex items-center justify-center text-sm text-ashen'>
          <BinocularsIcon />
          <span className='ml-2'>No tweets found</span>
        </div>
      )}
      {((!hasMore && tweets.length > 0) || (manual && tweets.length > 0)) && (
        <div className='flex justify-center text-sm text-ashen'>
          End of results
        </div>
      )}
    </section>
  )
}
