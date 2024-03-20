'use client'

import { cx } from 'class-variance-authority'
import { useRef } from 'react'
import { z } from 'zod'

import ErrorIcon from 'public/error.svg'
import PeopleIcon from 'public/people.svg'
import PublicIcon from 'public/public.svg'

import { post } from '@/actions/tweet/post'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Dropdown } from '@/components/dropdown'
import { FormError } from '@/components/form-error'
import { ImgPicker } from '@/components/img-picker'
import { ImgPreview } from '@/components/img-preview'
import { useForm } from '@/hooks/use-form'
import { MAX_CONTENT_LENGTH, TWEET_SCHEMA } from '@/lib/validations'

const onSubmit = async (data: FormData) => {
  try {
    await post(data)
  } catch (_) {
    throw Error('Failed to post tweet')
  }
}

export const TweetComposer = () => {
  const form = useForm<z.infer<typeof TWEET_SCHEMA>>(
    {
      content: '',
      img: '',
      followerOnly: 'N',
    },
    TWEET_SCHEMA
  )
  const imgPickerRef = useRef<HTMLInputElement>(null)

  return (
    <section className='flex flex-col rounded-md bg-pure p-2 shadow'>
      <div className='flex justify-between text-sm text-charcoal'>
        <span>Tweet something</span>
        <span
          className={cx(
            'mx-2',
            form.values.content.length > MAX_CONTENT_LENGTH && 'text-scarlet'
          )}
        >{`${form.values.content.length}/${MAX_CONTENT_LENGTH}`}</span>
      </div>
      <Divider />
      <textarea
        className='my-2 flex h-auto w-full rounded-md bg-pure p-2 text-md text-charcoal'
        name='content'
        value={form.values.content}
        onChange={(e) => form.handleChange('content', e.target.value)}
        onKeyDown={(e) => {
          e.key === 'Enter' && !e.shiftKey && form.handleSubmit(onSubmit)(e)
        }}
        placeholder="What's happening?"
      />
      {form.values.img instanceof File && (
        <ImgPreview
          img={form.values.img}
          onClear={() => {
            if (imgPickerRef.current) imgPickerRef.current.value = ''
            form.handleChange('img', '')
          }}
        />
      )}
      <div className='flex items-center justify-between'>
        <div className='flex'>
          <ImgPicker
            ref={imgPickerRef}
            onImageSelect={(e) =>
              form.handleChange('img', e.target.files?.[0] as File)
            }
          />
          <Dropdown className='left-0 w-52' closeOnSelect>
            <Dropdown.Trigger>
              <Button className='w-fit' variant='highlight'>
                {form.values.followerOnly === 'Y' ? (
                  <PeopleIcon />
                ) : (
                  <PublicIcon />
                )}
                <span className='ml-2 max-sm:hidden'>
                  {form.values.followerOnly === 'Y'
                    ? 'People you follow'
                    : 'Everyone can reply'}
                </span>
              </Button>
            </Dropdown.Trigger>
            <Dropdown.Content>
              <span className='text-bold text-sm text-charcoal'>
                Who can reply?
              </span>
              <span className='text-xs text-ashen'>
                Choose who can reply to this tweet
              </span>
              <Divider />
              <nav>
                <Button
                  className={cx(
                    'w-full',
                    form.values.followerOnly === 'N' && 'pointer-events-none'
                  )}
                  variant={
                    form.values.followerOnly === 'N' ? 'highlight' : 'secondary'
                  }
                  onClick={() => form.handleChange('followerOnly', 'N')}
                >
                  <PublicIcon />
                  <span className='ml-2'>Everyone can reply</span>
                </Button>
                <Button
                  className={cx(
                    'w-full',
                    form.values.followerOnly === 'Y' && 'pointer-events-none'
                  )}
                  variant={
                    form.values.followerOnly === 'Y' ? 'highlight' : 'secondary'
                  }
                  onClick={() => form.handleChange('followerOnly', 'Y')}
                >
                  <PeopleIcon />
                  <span className='ml-2'>People you follow</span>
                </Button>
              </nav>
            </Dropdown.Content>
          </Dropdown>
        </div>
        <div className='flex items-center'>
          {Object.keys(form.errors).length > 0 && (
            <Dropdown className='right-0 w-48' closeOnSelect>
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
              </Dropdown.Content>
            </Dropdown>
          )}
          <Button
            className='ml-2 w-fit'
            disabled={form.isSubmitting}
            isLoading={form.isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            Tweet
          </Button>
        </div>
      </div>
    </section>
  )
}
