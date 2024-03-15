import { Metadata } from 'next/types'

import { ForgotPassword } from '../_components/forgot-password'

export const metadata: Metadata = {
  title: 'Forgot Password | Flocker',
  description: 'Be social',
}

export default function ForgotPasswordPage() {
  return <ForgotPassword />
}
