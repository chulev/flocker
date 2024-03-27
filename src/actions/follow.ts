'use server'

import { getUserByHandle } from '@/data/user'
import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'

export const follow = async (handle: string, isFollowed: boolean) => {
  const currentUser = await getCurrentUserOrThrow()

  if (currentUser.handle === handle) throw Error('Cannot follow yourself')

  const follower = await getUserByHandle(currentUser.handle)
  const followee = await getUserByHandle(handle)

  if (isFollowed) {
    await db
      .insertInto('Follow')
      .values({
        followerId: follower.id,
        followeeId: followee.id,
      })
      .executeTakeFirstOrThrow()
  } else {
    await db
      .deleteFrom('Follow')
      .where((eb) =>
        eb.and([
          eb('followerId', '=', follower.id),
          eb('followeeId', '=', followee.id),
        ])
      )
      .executeTakeFirstOrThrow()
  }
}
