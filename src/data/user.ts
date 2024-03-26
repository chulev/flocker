import { db } from '@/lib/db/client'

export const getUserProfileByHandle = async (handle: string) => {
  return await db
    .selectFrom('User')
    .select((eb) => [
      'User.id',
      'User.name',
      'User.handle',
      'User.image',
      'User.cover',
      'User.description',
    ])
    .where('User.handle', '=', handle)
    .groupBy(['User.id'])
    .executeTakeFirst()
}

export const getUserByHandle = async (handle: string) => {
  return await db
    .selectFrom('User')
    .select(['id', 'handle'])
    .where('handle', '=', handle)
    .executeTakeFirstOrThrow()
}

export const getUserByEmail = async (email: string) => {
  return await db
    .selectFrom('User')
    .select(['id', 'email', 'handle', 'emailVerified'])
    .where('email', '=', email)
    .executeTakeFirst()
}
