'use client'

import { cx } from 'class-variance-authority'
import { useState } from 'react'

import BinocularsIcon from 'public/binoculars.svg'

import { UserCard } from '@/components/user/card'
import { useInfiniteLoader } from '@/hooks/use-infinite-loader'
import { useSSE } from '@/hooks/use-sse'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { PaginatedResponse, UserCard as UserCardType } from '@/lib/types'

import { Button } from '../button'
import { LoadNew } from '../load-new'
import { UserCardSkeleton } from './skeleton'

type Props<T> = {
  route: string
  limit?: number
  manual?: boolean
  currentUser: Awaited<ReturnType<typeof getCurrentUserOrThrow>>
  initialUsers: PaginatedResponse<T>
  inModal?: boolean
}

export const UserList = <T extends UserCardType>({
  route,
  limit,
  manual,
  currentUser,
  initialUsers,
  inModal = false,
}: Props<T>) => {
  const {
    data: users,
    setData: setUsers,
    isLoading,
    isError,
    hasMore,
    sentryRef,
    fetchMore,
  } = useInfiniteLoader<T>({
    route,
    limit,
    manual,
    initialData: initialUsers,
  })
  const [newUsers, setNewUsers] = useState<T[]>([])

  useSSE({
    FOLLOW: (follow) => {
      const user = users.find((user) => user.handle === follow.followee.handle)

      if (user) {
        const newUsers = users.map((user) =>
          user.handle === follow.followee.handle
            ? {
                ...user,
                followersCount: `${parseInt(user.followersCount, 10) + 1}`,
                ...(currentUser.handle === follow.follower.handle && {
                  following: true,
                }),
              }
            : user
        )
        setUsers(newUsers)
      } else if (
        [`/api/${follow.follower.handle}/following/?f=1`].includes(route)
      ) {
        setNewUsers((prevUsers) => [follow.followee, ...prevUsers] as T[])
      } else if (
        [`/api/${follow.followee.handle}/followers/?f=1`].includes(route)
      ) {
        setNewUsers((prevUsers) => [follow.follower, ...prevUsers] as T[])
      }
    },
    UNFOLLOW: (follow) => {
      const user = users.find((user) => user.handle === follow.followeeHandle)

      if (user) {
        const newUsers = users.map((user) =>
          user.handle === follow.followeeHandle
            ? {
                ...user,
                followersCount: `${parseInt(user.followersCount, 10) - 1}`,
                ...(currentUser.handle === follow.followerHandle && {
                  following: false,
                }),
              }
            : user
        )
        setUsers(newUsers)
      } else if (
        [`/api/${follow.followerHandle}/following/?f=1`].includes(route)
      ) {
        setNewUsers((prevUsers) =>
          prevUsers.filter((user) => user.handle !== follow.followeeHandle)
        )
      } else if (
        [`/api/${follow.followeeHandle}/followers/?f=1`].includes(route)
      ) {
        setNewUsers((prevUsers) =>
          prevUsers.filter((user) => user.handle !== follow.followerHandle)
        )
      }
    },
  })

  return (
    <section className='grid gap-3'>
      {newUsers.length > 0 && (
        <LoadNew
          className={cx(inModal ? 'top-[5px]' : 'top-[80px]')}
          onLoadNew={() => {
            setUsers([...newUsers, ...users])
            setNewUsers([])
          }}
          newCount={newUsers.length}
          singular='new user'
          plural='new users'
        />
      )}
      {users.map((user) => (
        <UserCard key={user.handle} currentUser={currentUser} {...user} />
      ))}
      {isLoading && <UserCardSkeleton count={4} />}
      {isError && (
        <div className='flex flex-col items-center justify-center text-sm text-ashen'>
          An error has occured
          <Button className='mt-1' onClick={() => fetchMore()}>
            Retry
          </Button>
        </div>
      )}
      {hasMore && !manual && <div ref={sentryRef} />}
      {!hasMore && !manual && users.length > 0 && (
        <div className='flex justify-center text-sm text-ashen'>
          End of results
        </div>
      )}
      {users.length === 0 && (
        <div className='flex items-center justify-center text-sm text-ashen'>
          <BinocularsIcon />
          <span className='ml-2'>No more users found</span>
        </div>
      )}
    </section>
  )
}
