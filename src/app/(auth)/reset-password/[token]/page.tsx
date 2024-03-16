import { Metadata } from 'next/types'

import { FormError } from '@/components/form-error'
import { fetchResetPasswordToken } from '@/data/token'

import { ResetPassword } from './_components/reset-password'

type Props = {
  params: {
    token: string
  }
}

export const metadata: Metadata = {
  title: 'Reset Password | Flocker',
  description: 'Be social',
}

export default async function ResetPasswordPage({ params: { token } }: Props) {
  const resetToken = await fetchResetPasswordToken(token)

  if (!resetToken) {
    return (
      <div className='flex justify-center'>
        <FormError message='Could not reset password' />
      </div>
    )
  }

  return <ResetPassword token={token} />
}
