'use client'

import CheckmarkIcon from 'public/checkmark.svg'
import FollowIcon from 'public/follow.svg'
import { useCallback } from 'react'

import { follow } from '@/actions/follow'
import { Button } from '@/components/button'
import { useOptimisticAction } from '@/hooks/use-optimistic-action'

type Props = {
  handle: string
  following: boolean
}

export const Follow = ({ handle, following }: Props) => {
  const [isFollowing, followUser] = useOptimisticAction(
    following,
    useCallback((isFollowing) => follow(handle, isFollowing), [handle])
  )

  return (
    <Button className='w-fit' size='xs' onClick={followUser}>
      {isFollowing ? <CheckmarkIcon /> : <FollowIcon />}
      <span className='ml-1'>{isFollowing ? 'Following' : 'Follow'}</span>
    </Button>
  )
}
