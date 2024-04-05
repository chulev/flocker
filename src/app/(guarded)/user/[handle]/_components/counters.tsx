'use client'

import { useEffect, useState } from 'react'

import { Count } from '@/components/count'
import { Link } from '@/components/link'
import { getUserProfileByHandle } from '@/data/user'
import { useSSE } from '@/hooks/use-sse'

type Props = {
  user: Awaited<ReturnType<typeof getUserProfileByHandle>>
}

export const Counters = ({ user }: Props) => {
  const [followingCount, setFollowingCount] = useState(
    user?.followingCount || '0'
  )
  const [followersCount, setFollowersCount] = useState(
    user?.followersCount || '0'
  )

  useSSE({
    FOLLOW: (follow) => {
      if (user?.handle === follow.follower.handle) {
        setFollowingCount(`${parseInt(followingCount, 10) + 1}`)
      } else if (user?.handle === follow.followee.handle) {
        setFollowersCount(`${parseInt(followersCount, 10) + 1}`)
      }
    },
    UNFOLLOW: (follow) => {
      if (user?.handle === follow.followerHandle) {
        setFollowingCount(`${parseInt(followingCount, 10) - 1}`)
      } else if (user?.handle === follow.followeeHandle) {
        setFollowersCount(`${parseInt(followersCount, 10) - 1}`)
      }
    },
  })

  return (
    <div className='flex flex-wrap items-center max-sm:justify-center md:mr-4'>
      <Link
        className='mr-4'
        href={`/user/${user?.handle}/following`}
        variant='ghost'
        scroll={false}
      >
        <Count count={followingCount} singular='following' plural='following' />
      </Link>
      <Link
        href={`/user/${user?.handle}/followers`}
        variant='ghost'
        scroll={false}
      >
        <Count count={followersCount} singular='follower' plural='followers' />
      </Link>
    </div>
  )
}
