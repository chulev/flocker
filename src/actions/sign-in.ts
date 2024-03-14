'use server'

import { signIn as authSignIn } from '@/lib/auth'
import { HOME_PATH } from '@/routes'

export const signIn = async (data: FormData) => {
  await authSignIn('credentials', {
    email: data.get('email'),
    password: data.get('password'),
    redirectTo: HOME_PATH,
  })
}
