import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { peopleQuery } from '@/lib/db/queries'
import { paginate } from '@/lib/paginate'
import { CursorType, Order, ResultType } from '@/lib/types'
import { DEFAULT_LIMIT } from '@/lib/validations'

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

export const getUserFollowing = async (
  handle: string,
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const user = await getUserByHandle(handle)

  if (!user) throw Error('User not found')

  const following = await peopleQuery(nextCursor, limit, order, currentUser.id)
    .leftJoin('Follow as Following', 'Following.followeeId', 'User.id')
    .where('Following.followerId', '=', user.id)
    .orderBy('User.id', order)
    .execute()

  return paginate<ResultType<typeof following>>(following, limit)
}

export const getUserFollowers = async (
  handle: string,
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const user = await getUserByHandle(handle)

  if (!user) throw Error('User not found')

  const followers = await peopleQuery(nextCursor, limit, order, currentUser.id)
    .leftJoin('Follow as Followers', 'Followers.followerId', 'User.id')
    .where('Followers.followeeId', '=', user.id)
    .orderBy('User.id', order)
    .execute()

  return paginate<ResultType<typeof followers>>(followers, limit)
}
