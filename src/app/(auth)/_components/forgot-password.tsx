'use client'

import { cx } from 'class-variance-authority'
import { z } from 'zod'

import { emailResetLink } from '@/actions/email-reset-link'
import { Button } from '@/components/button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { useForm } from '@/hooks/use-form'
import { FORGOT_PASSWORD_SCHEMA } from '@/lib/validations'
import { SIGN_IN_PATH } from '@/routes'

const onSubmit = async (data: FormData) => await emailResetLink(data)

export const ForgotPassword = () => {
  const form = useForm<z.infer<typeof FORGOT_PASSWORD_SCHEMA>>(
    {
      email: '',
    },
    FORGOT_PASSWORD_SCHEMA,
    { resetOnSubmit: false }
  )

  if (form.isSuccess) {
    return (
      <>
        <div className='my-4 text-sm text-charcoal'>
          A password reset link has been sent to your email address
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
        className={cx({ 'border border-scarlet': form.errors.email })}
        name='email'
        value={form.values.email}
        onChange={(e) => form.handleChange('email', e.target.value)}
        placeholder='Email'
        required
      />
      {form.errors.email && <FormError message={form.errors.email} />}
      <div className='my-4 flex justify-end'>
        <Link className='text-xs hover:text-charcoal' href={SIGN_IN_PATH}>
          Return to sign in
        </Link>
      </div>
      {form.errors.submission && <FormError message={form.errors.submission} />}
      <Button
        className='my-6 w-full justify-center'
        onClick={form.handleSubmit(onSubmit)}
        disabled={form.isSubmitting}
        isLoading={form.isSubmitting}
      >
        Reset password
      </Button>
    </form>
  )
}
