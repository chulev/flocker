'use client'

import { cx } from 'class-variance-authority'
import { z } from 'zod'

import { signUp } from '@/actions/sign-up'
import { Button } from '@/components/button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { useForm } from '@/hooks/use-form'
import { REGISTER_SCHEMA } from '@/lib/validations'
import { SIGN_IN_PATH } from '@/routes'

const onSubmit = async (data: FormData) => {
  try {
    await signUp(data)
  } catch (_) {
    throw Error('Sign up failed')
  }
}

export const SignUp = () => {
  const form = useForm<z.infer<typeof REGISTER_SCHEMA>>(
    {
      name: '',
      email: '',
      handle: '',
      password: '',
      confirmPassword: '',
    },
    REGISTER_SCHEMA,
    { resetOnSubmit: false }
  )

  if (form.isSuccess) {
    return (
      <>
        <div className='my-4 flex justify-center text-sm text-charcoal'>
          Thank you for signing up. A confirmation link has been sent to your
          email.
        </div>
        <div className='mt-8 flex flex-col items-center text-xs'>
          <Link className='text-xs hover:text-charcoal' href={SIGN_IN_PATH}>
            Return to sign in
          </Link>
        </div>
      </>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        className={cx({ 'border border-scarlet': form.errors.name })}
        name='name'
        value={form.values.name}
        onChange={(e) => form.handleChange('name', e.target.value)}
        placeholder='Name'
        required
      />
      {form.errors.name && <FormError message={form.errors.name} />}
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
        className={cx({ 'border border-scarlet': form.errors.handle })}
        name='handle'
        value={form.values.handle}
        onChange={(e) => form.handleChange('handle', e.target.value)}
        placeholder='Handle'
        required
      />
      {form.errors.handle && <FormError message={form.errors.handle} />}
      <Input
        className={cx({ 'border border-scarlet': form.errors.confirmPassword })}
        name='password'
        type='password'
        value={form.values.password}
        onChange={(e) => form.handleChange('password', e.target.value)}
        placeholder='Password'
        required
      />
      <Input
        className={cx({ 'border border-scarlet': form.errors.confirmPassword })}
        name='confirmPassword'
        type='password'
        value={form.values.confirmPassword}
        onChange={(e) => form.handleChange('confirmPassword', e.target.value)}
        placeholder='Confirm password'
        required
      />
      {form.errors.confirmPassword && (
        <FormError message={form.errors.confirmPassword} />
      )}
      {form.errors.submission && <FormError message={form.errors.submission} />}
      <Button
        className='my-6 w-full justify-center'
        onClick={form.handleSubmit(onSubmit)}
        disabled={form.isSubmitting}
        isLoading={form.isSubmitting}
      >
        Register
      </Button>
      <div className='mt-8 flex flex-col items-center text-xs'>
        <Link className='text-xs hover:text-charcoal' href={SIGN_IN_PATH}>
          Already have an account? Sign in
        </Link>
      </div>
    </form>
  )
}
