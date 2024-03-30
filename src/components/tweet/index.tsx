'use client'

import { cx } from 'class-variance-authority'

import ErrorIcon from 'public/error.svg'
import RefreshIcon from 'public/refresh.svg'

import { fetchTweetReplies } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { EnrichedTweet, LoaderType } from '@/lib/types'

import { Avatar } from '../avatar'
import { Divider } from '../divider'
import { Image } from '../image'
import { Link } from '../link'
import { TweetMenu } from './menu'
import { ReplyList } from './reply-list'

type Props = EnrichedTweet & {
  currentUser: Awaited<ReturnType<typeof getCurrentUserOrThrow>>
  deleted?: boolean
}

export const Tweet = ({
  content,
  id,
  date,
  currentUser,
  retweetId,
  reactions,
  userName,
  userImage,
  userHandle,
  retweeterName,
  retweeterHandle,
  imgPath,
  deleted,
  replies,
  followerOnly,
  following,
}: Props) => {
  return (
    <article className={cx('flex flex-col', { 'opacity-50': deleted })}>
      {!!retweetId && (
        <div className='mb-2 flex items-center text-xs text-charcoal'>
          <RefreshIcon className='shrink-0' />
          <span className='ml-1'>
            <Link href={`/user/${retweeterHandle}`} variant='ghost' size='xs'>
              {retweeterName}
            </Link>{' '}
            retweeted
          </span>
        </div>
      )}
      <div className='relative flex w-full flex-col rounded-md bg-pure p-3 shadow'>
        <div className='flex items-center'>
          <Avatar variant='sm' src={userImage} alt={userName ?? 'Avatar'} />
          <div className='ml-2 flex flex-col'>
            <Link
              className='mr-4'
              href={`/user/${userHandle}`}
              variant='ghost'
              size='md'
            >
              {userName}
            </Link>
            <span className='text-xs text-ashen'>{date}</span>
          </div>
        </div>
        {content}
        {imgPath && (
          <div className='relative mb-2 h-64 w-full'>
            <Image
              className='object-contain'
              src={imgPath}
              alt='Tweet image'
              fill
            />
          </div>
        )}
        <Divider />
        <TweetMenu
          tweetId={id}
          retweetId={retweetId}
          currentUser={currentUser}
          retweeted={reactions.retweeted}
          liked={reactions.liked}
          saved={reactions.saved}
          followerOnly={
            currentUser.handle !== userHandle && followerOnly && !following
          }
          deleted={deleted}
        />
        <Divider />
        <ReplyList<LoaderType<typeof fetchTweetReplies>>
          initialReplies={replies}
          route={`/api/${id}/replies?f=1`}
          followerOnly={
            currentUser.handle !== userHandle && followerOnly && !following
          }
        />
        {deleted && (
          <div className='absolute right-3 top-3 flex items-center text-sm text-scarlet'>
            <ErrorIcon />
            <span className='ml-1'>Deleted</span>
          </div>
        )}
      </div>
    </article>
  )
}
