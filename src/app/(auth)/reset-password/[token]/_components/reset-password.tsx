'use client'

import { cx } from 'class-variance-authority'
import type { z } from 'zod'

import { resetPassword } from '@/actions/reset-password'
import { Button } from '@/components/button'
import { FormError } from '@/components/form-error'
import { Input } from '@/components/input'
import { Link } from '@/components/link'
import { useForm } from '@/hooks/use-form'
import { RESET_PASSWORD_SCHEMA } from '@/lib/validations'
import { SIGN_IN_PATH } from '@/routes'

const onSubmit = async (data: FormData) => await resetPassword(data)

type Props = {
  token: string
}

export const ResetPassword = ({ token }: Props) => {
  const form = useForm<z.infer<typeof RESET_PASSWORD_SCHEMA>>(
    {
      token,
      password: '',
      confirmPassword: '',
    },
    RESET_PASSWORD_SCHEMA,
    { resetOnSubmit: false }
  )

  if (form.isSuccess) {
    return (
      <>
        <div className='my-4 flex justify-center text-sm text-charcoal'>
          Password has been successfully reset
        </div>
        <div className='mt-8 flex flex-col items-center text-xs'>
          <Link size='xs' href={SIGN_IN_PATH}>
            Return to sign in
          </Link>
        </div>
      </>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
        Reset password
      </Button>
    </form>
  )
}
