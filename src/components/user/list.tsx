'use client'

import BinocularsIcon from 'public/binoculars.svg'

import { UserCard } from '@/components/user/card'
import { useInfiniteLoader } from '@/hooks/use-infinite-loader'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { PaginatedResponse, UserCard as UserCardType } from '@/lib/types'

import { Button } from '../button'
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

  return (
    <section className='grid gap-3'>
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
