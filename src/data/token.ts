import { db } from '@/lib/db/client'
import { UUID_SCHEMA } from '@/lib/validations'

export const fetchVerificationToken = async (token: string) => {
  const validatedToken = UUID_SCHEMA.safeParse(token)

  if (!validatedToken.success) return null

  return await db
    .selectFrom('VerificationToken')
    .selectAll()
    .where('id', '=', token)
    .executeTakeFirst()
}

export const fetchResetPasswordToken = async (token: string) => {
  const validatedToken = UUID_SCHEMA.safeParse(token)

  if (!validatedToken.success) return null

  return await db
    .selectFrom('ResetPasswordToken')
    .selectAll()
    .where('id', '=', token)
    .executeTakeFirst()
}
