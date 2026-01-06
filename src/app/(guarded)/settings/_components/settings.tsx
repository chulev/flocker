'use client'

import { cx } from 'class-variance-authority'
import { useRef } from 'react'
import type { z } from 'zod'

import { update } from '@/actions/settings'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { FormError } from '@/components/form-error'
import { Image } from '@/components/image'
import { ImgPicker } from '@/components/img-picker'
import { Input } from '@/components/input'
import { useForm } from '@/hooks/use-form'
import type { fetchUser } from '@/lib/auth'
import {
  MAX_BIO_LENGTH,
  MAX_HANDLE_LENGTH,
  MAX_NAME_LENGTH,
  SETTINGS_SCHEMA,
} from '@/lib/validations'

type Props = {
  currentUser: Awaited<ReturnType<typeof fetchUser>>
}

const onSubmit = async (data: FormData) => await update(data)

export const Settings = ({ currentUser }: Props) => {
  const form = useForm<z.infer<typeof SETTINGS_SCHEMA>>(
    {
      name: currentUser?.name ?? '',
      handle: currentUser?.handle ?? '',
      bio: currentUser?.description ?? '',
      avatar: currentUser?.image ?? '',
      cover: currentUser?.cover ?? '',
    },
    SETTINGS_SCHEMA,
    { resetOnSubmit: false }
  )
  const avatarPickerRef = useRef<HTMLInputElement>(null)
  const coverPickerRef = useRef<HTMLInputElement>(null)

  return (
    <div className='flex w-full flex-col rounded-md bg-pure p-2 shadow'>
      <span className='text-sm text-charcoal'>Settings</span>
      <Divider />
      <Input
        className={cx({ 'border border-scarlet': form.errors.name })}
        name='name'
        value={form.values.name}
        onChange={(e) => form.handleChange('name', e.target.value)}
        placeholder='Name'
        lengthLimit={MAX_NAME_LENGTH}
        required
      />
      {form.errors.name && (
        <FormError className='mb-2' message={form.errors.name} />
      )}
      <Input
        className={cx({ 'border border-scarlet': form.errors.handle })}
        name='handle'
        value={form.values.handle}
        onChange={(e) => form.handleChange('handle', e.target.value)}
        placeholder='Handle'
        lengthLimit={MAX_HANDLE_LENGTH}
        required
      />
      {form.errors.handle && (
        <FormError className='mb-2' message={form.errors.handle} />
      )}
      <Input
        className={cx({ 'border border-scarlet': form.errors.bio })}
        name='bio'
        value={form.values.bio}
        onChange={(e) => form.handleChange('bio', e.target.value)}
        placeholder='Bio'
        lengthLimit={MAX_BIO_LENGTH}
        required
      />
      {form.errors.bio && (
        <FormError className='mb-2' message={form.errors.bio} />
      )}
      <div className='mb-2 flex items-center'>
        <label
          className='mr-2 text-sm font-medium text-charcoal'
          htmlFor='avatar'
        >
          Avatar
        </label>
        <ImgPicker
          name='avatar'
          label='Pick avatar'
          ref={avatarPickerRef}
          onImageSelect={(e) =>
            form.handleChange('avatar', e.target.files?.[0] || '')
          }
        />
      </div>
      <div className='relative w-fit'>
        <Avatar
          src={
            form.values.avatar instanceof File
              ? URL.createObjectURL(form.values.avatar as Blob | MediaSource)
              : form.values.avatar
          }
          variant='lg'
          alt={currentUser?.name || 'User'}
        />
      </div>
      {form.errors.avatar && (
        <FormError className='mb-2' message={form.errors.avatar} />
      )}
      <div className='my-2 flex items-center'>
        <label
          className='mr-2 text-sm font-medium text-charcoal'
          htmlFor='cover'
        >
          Cover
        </label>
        <ImgPicker
          name='cover'
          label='Pick cover'
          ref={coverPickerRef}
          onImageSelect={(e) =>
            form.handleChange('cover', e.target.files?.[0] || '')
          }
        />
      </div>
      {form.values.cover && (
        <div className='relative h-24'>
          <Image
            className='h-24 object-cover'
            src={
              form.values.cover instanceof File
                ? URL.createObjectURL(form.values.cover as Blob | MediaSource)
                : form.values.cover
            }
            alt='Cover'
            fill
          />
        </div>
      )}
      {form.errors.cover && <FormError message={form.errors.cover} />}
      {form.errors.submission && <FormError message={form.errors.submission} />}
      <Button
        className='my-4 w-fit justify-center'
        onClick={form.handleSubmit(onSubmit)}
        disabled={form.isSubmitting}
        isLoading={form.isSubmitting}
      >
        Save
      </Button>
    </div>
  )
}
