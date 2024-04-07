'use client'

import { cx } from 'class-variance-authority'
import { signIn as authSignIn } from 'next-auth/react'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { useSearchParams } from 'next/navigation'
import { z } from 'zod'

import GoogleIcon from 'public/google.svg'

import { signIn } from '@/actions/sign-in'
import { Button } from '@/components/button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { useEvent } from '@/hooks/use-event'
import { useForm } from '@/hooks/use-form'
import { LOGIN_SCHEMA } from '@/lib/validations'

export const SignIn = () => {
  const searchParams = useSearchParams()
  const form = useForm<z.infer<typeof LOGIN_SCHEMA>>(
    {
      email: '',
      password: '',
    },
    LOGIN_SCHEMA,
    { resetOnSubmit: false }
  )

  const onSubmit = useEvent(async (data: FormData) => {
    try {
      await signIn(data)
    } catch (error) {
      if (isRedirectError(error)) throw error

      throw Error('Sign in failed')
    }
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        className={cx({ 'border border-scarlet': form.errors.email })}
        name='email'
        value={form.values.email}
        onChange={(e) => form.handleChange('email', e.target.value)}
        placeholder='Email'
        required
      />
      {form.errors.email && <FormError message={form.errors.email} />}
      <Input
        className={cx({ 'border border-scarlet': form.errors.password })}
        name='password'
        type='password'
        value={form.values.password}
        onChange={(e) => form.handleChange('password', e.target.value)}
        placeholder='Password'
        required
      />
      {form.errors.password && <FormError message={form.errors.password} />}
      {(searchParams.get('error') || form.errors.submission) && (
        <FormError message='Sign in failed' />
      )}
      <div className='my-4 flex justify-end'>
        <Link className='text-xs hover:text-charcoal' href='/forgot-password'>
          Forgot password?
        </Link>
      </div>
      <Button
        className='my-6 w-full justify-center'
        onClick={form.handleSubmit(onSubmit)}
        disabled={form.isSubmitting}
        isLoading={form.isSubmitting}
      >
        Sign in
      </Button>
      <Button
        className='w-full justify-center rounded-md border border-ashen'
        onClick={(e) => {
          e.preventDefault()
          authSignIn('google', {
            callbackUrl: process.env.NEXT_PUBLIC_APP_URL,
          })
        }}
        variant='secondary'
      >
        <GoogleIcon />
        <span className='ml-1'>Sign in with Google</span>
      </Button>
      <div className='mt-8 flex justify-center'>
        <Link size='xs' href='/sign-up'>
          New to Flocker? Sign up
        </Link>
      </div>
    </form>
  )
}
