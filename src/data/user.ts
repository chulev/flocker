import { db } from '@/lib/db/client'

export const getUserByEmail = async (email: string) => {
  return await db
    .selectFrom('User')
    .select(['id', 'email', 'handle', 'emailVerified'])
    .where('email', '=', email)
    .executeTakeFirst()
}
