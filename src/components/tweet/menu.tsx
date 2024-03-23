'use client'

import { cx } from 'class-variance-authority'

import LikeIcon from 'public/like.svg'
import ReplyIcon from 'public/reply.svg'
import RetweetIcon from 'public/retweet.svg'
import SaveIcon from 'public/save.svg'

import { like } from '@/actions/tweet/like-tweet'
import { retweet } from '@/actions/tweet/retweet'
import { save } from '@/actions/tweet/save'
import { useEvent } from '@/hooks/use-event'
import { useOptimisticAction } from '@/hooks/use-optimistic-action'

import { Button } from '../button'

type Props = {
  tweetId: string
  retweetId: string | null
  retweeted: boolean
  liked: boolean
  saved: boolean
  followerOnly: boolean
  deleted?: boolean
}

export const TweetMenu = ({
  tweetId,
  retweetId,
  retweeted,
  liked,
  saved,
  followerOnly,
  deleted,
}: Props) => {
  const [isRetweeted, retweetTweet] = useOptimisticAction(
    retweeted,
    useEvent((isRetweeted) => retweet(tweetId, isRetweeted))
  )
  const [isLiked, likeTweet] = useOptimisticAction(
    liked,
    useEvent((isLiked) => like(tweetId, isLiked))
  )
  const [isSaved, saveTweet] = useOptimisticAction(
    saved,
    useEvent((isSaved) => save(tweetId, isSaved))
  )

  return (
    <nav className='flex'>
      {!followerOnly && (
        <Button
          className='shrink grow basis-auto justify-center [&>span]:max-sm:hidden'
          variant='secondary'
          disabled={deleted}
          onClick={() => {}}
        >
          <ReplyIcon />
          <span className='ml-2'>Reply</span>
        </Button>
      )}
      {!retweetId && (
        <Button
          className={cx(
            'shrink grow basis-auto justify-center [&>span]:max-sm:hidden',
            { 'text-verdant': isRetweeted }
          )}
          variant='secondary'
          disabled={deleted}
          onClick={retweetTweet}
        >
          <RetweetIcon />
          <span className='ml-2'>{isRetweeted ? 'Retweeted' : 'Retweet'}</span>
        </Button>
      )}
      <Button
        className={cx(
          'shrink grow basis-auto justify-center [&>span]:max-sm:hidden',
          { 'text-scarlet': isLiked }
        )}
        variant='secondary'
        disabled={deleted}
        onClick={likeTweet}
      >
        <LikeIcon />
        <span className='ml-2'>{isLiked ? 'Liked' : 'Like'}</span>
      </Button>
      <Button
        className={cx(
          'shrink grow basis-auto justify-center [&>span]:max-sm:hidden'
        )}
        variant={isSaved ? 'highlight' : 'secondary'}
        disabled={deleted}
        onClick={saveTweet}
      >
        <SaveIcon />
        <span className='ml-2'>{isSaved ? 'Saved' : 'Save'}</span>
      </Button>
    </nav>
  )
}
