'use server'

import { getUserByEmail } from '@/data/user'
import { generatePasswordResetToken } from '@/lib/auth/token'
import { sendPasswordResetEmail } from '@/lib/mail'
import { formDataToValues } from '@/lib/serialize'
import { FORGOT_PASSWORD_SCHEMA } from '@/lib/validations'

export const emailResetLink = async (data: FormData) => {
  const deserializedValues = formDataToValues(data)
  const { email } = FORGOT_PASSWORD_SCHEMA.parse(deserializedValues)
  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.emailVerified) return

  const verificationToken = await generatePasswordResetToken(existingUser.email)
  await sendPasswordResetEmail(verificationToken.email, verificationToken.id)
}
