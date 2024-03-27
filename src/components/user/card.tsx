import { Link } from '@/components/link'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { UserCard as UserCardType } from '@/lib/types'

import { Avatar } from '../avatar'
import { Count } from '../count'
import { Follow } from './follow'

type Props = UserCardType & {
  currentUser: Awaited<ReturnType<typeof getCurrentUserOrThrow>>
}

export const UserCard = ({
  currentUser,
  name,
  handle,
  description,
  image,
  followersCount,
  following,
}: Props) => (
  <section className='flex flex-col rounded-md bg-pure p-2 shadow'>
    <div className='flex w-full items-center'>
      <Avatar variant='sm' src={image} alt={name} />
      <div className='mx-2 flex w-0 flex-1 flex-col truncate'>
        <Link href={`/user/${handle}`} variant='ghost'>
          {name} {handle === currentUser.handle && '(You)'}
        </Link>
        <span className='truncate text-xs text-ashen'>
          <Count
            count={followersCount}
            singular='follower'
            plural='followers'
          />
        </span>
      </div>
      {handle !== currentUser.handle && (
        <Follow handle={handle} following={following} />
      )}
    </div>
    {description && (
      <span className='mt-2 line-clamp-3 text-sm text-charcoal'>
        {description}
      </span>
    )}
  </section>
)
