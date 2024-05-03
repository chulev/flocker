'use client'

import { cx } from 'class-variance-authority'
import { useCallback } from 'react'

import LikeIcon from 'public/like.svg'

import { likeReply } from '@/actions/tweet/like-reply'
import { useOptimisticAction } from '@/hooks/use-optimistic-action'
import type { Reply as ReplyType } from '@/lib/types'
import { extractDateFromUUID } from '@/lib/uuid'

import { Avatar } from '../avatar'
import { Button } from '../button'
import { Count } from '../count'
import { Image } from '../image'
import { Link } from '../link'

type Props = ReplyType

export const Reply = ({
  content,
  id,
  userName,
  userImage,
  userHandle,
  imgPath,
  likeCount,
  liked,
}: Props) => {
  const [isLiked, like] = useOptimisticAction(
    liked,
    useCallback((isLiked) => likeReply(id, isLiked), [id])
  )

  return (
    <section key={id} className='mt-2 flex w-full'>
      <Avatar variant='sm' src={userImage} alt={userName} />
      <section className='flex flex-1 flex-col'>
        <section className='ml-2 rounded-md bg-foggy p-2'>
          <div className='mb-2 flex items-center max-sm:flex-col max-sm:items-start'>
            <Link className='mr-2' href={`/user/${userHandle}`} variant='ghost'>
              {userName}
            </Link>
            <span suppressHydrationWarning className='text-xs text-ashen'>
              {extractDateFromUUID(id)}
            </span>
          </div>
          <p className='text-sm text-charcoal'>{content}</p>
          {imgPath && (
            <div className='relative my-2 h-32 w-full'>
              <Image
                className='object-contain object-left'
                src={imgPath}
                fill
                alt='Reply image'
              />
            </div>
          )}
        </section>
        <div className='flex items-center'>
          <Button
            className={cx('mr-2 w-fit', { 'text-scarlet': isLiked })}
            variant='ghost'
            onClick={like}
          >
            <LikeIcon />
            <span className='ml-1'>{isLiked ? 'Liked' : 'Like'}</span>
          </Button>
          <Count
            className='text-xs text-ashen'
            count={likeCount}
            singular='like'
            plural='likes'
          />
        </div>
      </section>
    </section>
  )
}
