'use client'

import PeopleIcon from 'public/people.svg'
import RefreshIcon from 'public/refresh.svg'

import { useInfiniteLoader } from '@/hooks/use-infinite-loader'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { EnrichedReply, PaginatedResponse } from '@/lib/types'
import { REPLY_LIMIT } from '@/lib/validations'

import { Button } from '../button'
import { Reply } from './reply'

type Props<T> = {
  followerOnly: boolean
  route: string
  initialReplies: PaginatedResponse<T>
}

export const ReplyList = <T extends EnrichedReply>({
  followerOnly,
  route,
  initialReplies,
}: Props<T>) => {
  const {
    data: replies,
    isLoading,
    isError,
    hasMore,
    fetchMore,
  } = useInfiniteLoader<T>({
    initialData: initialReplies,
    route,
    limit: REPLY_LIMIT,
    manual: true,
  })

  return (
    <>
      {followerOnly && (
        <div className='my-2 flex items-center text-sm text-charcoal'>
          <PeopleIcon className='mr-1' />
          Only those followed by this user can reply to the tweet
        </div>
      )}
      {replies.map((reply) => (
        <Reply key={reply.id} {...reply} />
      ))}
      {hasMore && (
        <Button
          variant='highlight'
          onClick={() => fetchMore()}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading && !isError && 'Loading...'}
          {isError && !isLoading && (
            <>
              <>
                <RefreshIcon />
                <span className='ml-2'>An error has occured. Retry?</span>
              </>
            </>
          )}
          {!isError && !isLoading && (
            <>
              <RefreshIcon />
              <span className='ml-2'>Load more</span>
            </>
          )}
        </Button>
      )}
    </>
  )
}
