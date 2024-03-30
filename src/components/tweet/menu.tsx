'use client'

import { cx } from 'class-variance-authority'
import { useRef, useState } from 'react'
import { z } from 'zod'

import ErrorIcon from 'public/error.svg'
import LikeIcon from 'public/like.svg'
import ReplyIcon from 'public/reply.svg'
import RetweetIcon from 'public/retweet.svg'
import SaveIcon from 'public/save.svg'
import SendIcon from 'public/send.svg'

import { like } from '@/actions/tweet/like-tweet'
import { reply } from '@/actions/tweet/reply'
import { retweet } from '@/actions/tweet/retweet'
import { save } from '@/actions/tweet/save'
import { useEvent } from '@/hooks/use-event'
import { useForm } from '@/hooks/use-form'
import { useOptimisticAction } from '@/hooks/use-optimistic-action'
import { getCurrentUserOrThrow } from '@/lib/auth'
import { MAX_CONTENT_LENGTH, REPLY_SCHEMA } from '@/lib/validations'

import { Avatar } from '../avatar'
import { Button } from '../button'
import { Divider } from '../divider'
import { Dropdown } from '../dropdown'
import { FormError } from '../form-error'
import { ImgPicker } from '../img-picker'
import { ImgPreview } from '../img-preview'
import { Input } from '../input'

type Props = {
  tweetId: string
  retweetId: string | null
  retweeted: boolean
  liked: boolean
  saved: boolean
  followerOnly: boolean
  deleted?: boolean
  currentUser: Awaited<ReturnType<typeof getCurrentUserOrThrow>>
}

export const TweetMenu = ({
  tweetId,
  retweetId,
  retweeted,
  liked,
  saved,
  followerOnly,
  currentUser,
  deleted,
}: Props) => {
  const [replyBox, toggleReplyBox] = useState(false)
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

  const form = useForm<z.infer<typeof REPLY_SCHEMA>>(
    {
      content: '',
      img: '',
      followerOnly: followerOnly ? 'Y' : 'N',
    },
    REPLY_SCHEMA
  )
  const imgPickerRef = useRef<HTMLInputElement>(null)

  const onSubmit = useEvent(async (data: FormData) => {
    try {
      await reply(tweetId, data)
    } catch (_) {
      throw Error('Failed to reply')
    }
  })

  return (
    <>
      <nav className='flex'>
        {!followerOnly && (
          <Button
            className='shrink grow basis-auto justify-center [&>span]:max-sm:hidden'
            variant='secondary'
            disabled={deleted}
            onClick={() => toggleReplyBox((open) => !open)}
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
            <span className='ml-2'>
              {isRetweeted ? 'Retweeted' : 'Retweet'}
            </span>
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
      {replyBox && (
        <>
          <Divider />
          <div className='my-2 flex items-center justify-center'>
            <Avatar
              variant='sm'
              src={currentUser.image}
              alt={currentUser.name || 'User'}
            />
            <div className='ml-2 flex h-full flex-1 items-center rounded-md border border-ashen border-opacity-10 bg-foggy text-sm text-charcoal focus-within:border-sky'>
              <Input
                name='content'
                value={form.values.content}
                onChange={(e) => form.handleChange('content', e.target.value)}
                onKeyDown={(e) => {
                  e.key === 'Enter' &&
                    !e.shiftKey &&
                    form.handleSubmit(onSubmit)(e)
                }}
                placeholder='Reply'
                required
                variant='secondary'
                withLabel={false}
              />
              {Object.keys(form.errors).length > 0 && (
                <Dropdown className='right-0 w-52'>
                  <Dropdown.Trigger>
                    <Button className='w-fit' variant='warning'>
                      <ErrorIcon />
                    </Button>
                  </Dropdown.Trigger>
                  <Dropdown.Content>
                    {form.errors.content && (
                      <FormError message={form.errors.content} />
                    )}
                    {form.errors.img && <FormError message={form.errors.img} />}
                    {form.errors.submission && (
                      <FormError message={form.errors.submission} />
                    )}
                  </Dropdown.Content>
                </Dropdown>
              )}
              <span
                className={cx(
                  'mx-2',
                  form.values.content.length > MAX_CONTENT_LENGTH &&
                    'text-scarlet'
                )}
              >{`${form.values.content.length}/${MAX_CONTENT_LENGTH}`}</span>
              <Button
                variant='highlight'
                onClick={form.handleSubmit(onSubmit)}
                isLoading={form.isSubmitting}
                disabled={form.isSubmitting}
              >
                <SendIcon />
              </Button>
              <ImgPicker
                ref={imgPickerRef}
                onImageSelect={(e) =>
                  form.handleChange('img', e.target.files?.[0] as File)
                }
              />
            </div>
          </div>
          {form.values.img instanceof File && (
            <ImgPreview
              img={form.values.img}
              onClear={() => {
                if (imgPickerRef.current) imgPickerRef.current.value = ''
                form.handleChange('img', '')
              }}
            />
          )}
        </>
      )}
    </>
  )
}
