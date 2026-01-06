import type { Metadata } from 'next/types'

import { SignIn } from '../_components/sign-in'

export const metadata: Metadata = {
  title: 'Sign In | Flocker',
  description: 'Be social',
}

export default function SignInPage() {
  return <SignIn />
}
