'use server'

import { fetchUserByHandle, getUserByHandle } from '@/data/user'
import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { publish } from '@/lib/store/client'
import { MAIN_CHANNEL_KEY } from '@/lib/validations'

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

    const publishedFollower = await fetchUserByHandle(currentUser.handle)
    const publishedFollowee = await fetchUserByHandle(handle)

    await publish(MAIN_CHANNEL_KEY, {
      type: 'FOLLOW',
      data: {
        follower: publishedFollower,
        followee: publishedFollowee,
      },
    })
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

    await publish(MAIN_CHANNEL_KEY, {
      type: 'UNFOLLOW',
      data: {
        followerHandle: follower.handle,
        followeeHandle: followee.handle,
      },
    })
  }
}
