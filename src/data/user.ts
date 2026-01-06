import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { peopleQuery } from '@/lib/db/queries'
import { paginate } from '@/lib/paginate'
import type { CursorType, Order, ResultType } from '@/lib/types'
import { DEFAULT_LIMIT, WHO_TO_FOLLOW_LIMIT } from '@/lib/validations'

export const getUserProfileByHandle = async (handle: string) => {
  return await db
    .selectFrom('User')
    .leftJoin('Follow as Following', 'Following.followerId', 'User.id')
    .leftJoin('Follow as Followers', 'Followers.followeeId', 'User.id')
    .select((eb) => [
      'User.id',
      'User.name',
      'User.handle',
      'User.image',
      'User.cover',
      'User.description',
      eb.fn.count<string>('Following.id').distinct().as('followingCount'),
      eb.fn.count<string>('Followers.id').distinct().as('followersCount'),
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

export const fetchUserByHandle = async (handle: string) => {
  const currentUser = await getCurrentUserOrThrow()

  return await peopleQuery(null, 1, 'desc', currentUser.id)
    .where('User.handle', '=', handle)
    .executeTakeFirstOrThrow()
}

export const getUserByEmail = async (email: string) => {
  return await db
    .selectFrom('User')
    .select(['id', 'email', 'handle', 'emailVerified'])
    .where('email', '=', email)
    .executeTakeFirst()
}

export const fetchWhoToFollow = async (
  nextCursor: CursorType = null,
  limit: number = WHO_TO_FOLLOW_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const whoToFollow = await peopleQuery(
    nextCursor,
    limit,
    order,
    currentUser.id
  )
    .leftJoin(
      (qb) =>
        qb
          .selectFrom('Follow')
          .select('Follow.followeeId')
          .where('Follow.followerId', '=', currentUser.id)
          .as('Follows'),
      (join) => join.onRef('User.id', '=', 'Follows.followeeId')
    )
    .where((eb) =>
      eb.and([
        eb('Follows.followeeId', 'is', null),
        eb('User.id', '!=', currentUser.id),
      ])
    )
    .orderBy('User.id', order)
    .execute()

  return paginate<ResultType<typeof whoToFollow>>(whoToFollow, limit)
}

export const fetchPeople = async (
  nextCursor: CursorType = null,
  limit: number = DEFAULT_LIMIT,
  order: Order = 'desc'
) => {
  const currentUser = await getCurrentUserOrThrow()
  const people = await peopleQuery(nextCursor, limit, order, currentUser.id)
    .orderBy('User.id', order)
    .execute()

  return paginate<ResultType<typeof people>>(people, limit)
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
