import { Metadata } from 'next/types'

import { SignUp } from '../_components/sign-up'

export const metadata: Metadata = {
  title: 'Sign Up | Flocker',
  description: 'Be social',
}

export default function SignUpPage() {
  return <SignUp />
}
