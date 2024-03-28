import { Metadata } from 'next/types'

import PeopleIcon from 'public/people.svg'

import { Divider } from '@/components/divider'
import { UserList } from '@/components/user/list'
import { getUserFollowers } from '@/data/user'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

type Props = {
  params: {
    handle: string
  }
}

export async function generateMetadata({
  params: { handle },
}: Props): Promise<Metadata> {
  return {
    title: `${handle} Followers | Flocker`,
    description: 'Be social',
  }
}

export default async function FollowersPage({ params: { handle } }: Props) {
  const currentUser = await getCurrentUserOrThrow()
  const initialUsers = await getUserFollowers(handle)

  return (
    <div className='grid rounded-md bg-pure p-2 shadow'>
      <div className='flex items-center text-sm text-charcoal'>
        <PeopleIcon className='mr-1' />
        Followers
      </div>
      <Divider />
      <UserList<LoaderType<typeof getUserFollowers>>
        route={`/api/${handle}/followers/?f=1`}
        currentUser={currentUser}
        initialUsers={initialUsers}
      />
    </div>
  )
}
