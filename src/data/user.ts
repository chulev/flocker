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

export const doesCurrentUserFollow = async (
  currentUserHandle: string,
  userHandle: string
) => {
  const follow = await db
    .selectFrom('Follow')
    .leftJoin('User as Follower', 'Follower.id', 'Follow.followerId')
    .leftJoin('User as Followee', 'Followee.id', 'Follow.followeeId')
    .where((eb) =>
      eb.and([
        eb('Follower.handle', '=', currentUserHandle),
        eb('Followee.handle', '=', userHandle),
      ])
    )
    .select(['Follow.id'])
    .executeTakeFirst()

  return !!follow?.id
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
