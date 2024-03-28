import { Metadata } from 'next/types'

import PeopleIcon from 'public/people.svg'

import { Divider } from '@/components/divider'
import { UserList } from '@/components/user/list'
import { getUserFollowing } from '@/data/user'
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
    title: `${handle} Following | Flocker`,
    description: 'Be social',
  }
}

export default async function FollowingPage({ params: { handle } }: Props) {
  const currentUser = await getCurrentUserOrThrow()
  const initialUsers = await getUserFollowing(handle)

  return (
    <div className='grid rounded-md bg-pure p-2 shadow'>
      <div className='flex items-center text-sm text-charcoal'>
        <PeopleIcon className='mr-1' />
        Following
      </div>
      <Divider />
      <UserList<LoaderType<typeof getUserFollowing>>
        route={`/api/${handle}/following/?f=1`}
        currentUser={currentUser}
        initialUsers={initialUsers}
      />
    </div>
  )
}
