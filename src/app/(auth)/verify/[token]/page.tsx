import { Metadata } from 'next/types'

import { verifyEmail } from '@/actions/verify-email'
import { FormError } from '@/components/form-error'
import { Link } from '@/components/link'
import { SIGN_IN_PATH } from '@/routes'

type Props = {
  params: {
    token: string
  }
}

export const metadata: Metadata = {
  title: 'Verify Email | Flocker',
  description: 'Be social',
}

export default async function VerifyPage({ params: { token } }: Props) {
  try {
    await verifyEmail(token)
  } catch (_) {
    return (
      <div className='flex justify-center'>
        <FormError message='Could not verify email' />
      </div>
    )
  }

  return (
    <>
      <div className='my-4 flex justify-center text-sm text-charcoal'>
        Your email has been verified successfully.
      </div>
      <div className='mt-8 flex flex-col items-center text-xs'>
        <Link className='text-xs hover:text-charcoal' href={SIGN_IN_PATH}>
          Return to sign in
        </Link>
      </div>
    </>
  )
}
