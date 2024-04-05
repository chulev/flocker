'use client'

import PeopleIcon from 'public/people.svg'
import RefreshIcon from 'public/refresh.svg'

import { useInfiniteLoader } from '@/hooks/use-infinite-loader'
import { useSSE } from '@/hooks/use-sse'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { EnrichedReply, PaginatedResponse } from '@/lib/types'
import { REPLY_LIMIT } from '@/lib/validations'

import { Button } from '../button'
import { Reply } from './reply'

type Props<T> = {
  tweetId: string
  followerOnly: boolean
  route: string
  currentUser: Awaited<ReturnType<typeof getCurrentUserOrThrow>>
  initialReplies: PaginatedResponse<T>
}

export const ReplyList = <T extends EnrichedReply>({
  tweetId,
  followerOnly,
  route,
  currentUser,
  initialReplies,
}: Props<T>) => {
  const {
    data: replies,
    setData: setReplies,
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

  useSSE({
    REPLY: (reply) => {
      if (reply.tweetId === tweetId) {
        const { tweetId, ...newReply } = reply
        setReplies([newReply as T, ...replies])
      }
    },
    REPLY_LIKE: (like) => {
      const reply = replies.find((reply) => reply.id === like.replyId)

      if (reply) {
        const newReplies = replies.map((reply) =>
          reply.id === like.replyId
            ? {
                ...reply,
                likeCount: `${parseInt(reply.likeCount, 10) + 1}`,
                ...(currentUser.handle === like.handle && { liked: true }),
              }
            : reply
        )
        setReplies(newReplies)
      }
    },
    REPLY_UNDO_LIKE: (like) => {
      const reply = replies.find((reply) => reply.id === like.replyId)

      if (reply) {
        const newReplies = replies.map((reply) =>
          reply.id === like.replyId
            ? {
                ...reply,
                likeCount: `${parseInt(reply.likeCount, 10) - 1}`,
                ...(currentUser.handle === like.handle && { liked: false }),
              }
            : reply
        )
        setReplies(newReplies)
      }
    },
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
