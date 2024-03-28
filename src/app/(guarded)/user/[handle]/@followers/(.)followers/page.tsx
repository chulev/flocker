import { Metadata } from 'next/types'

import { Modal } from '@/components/modal'
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

export default async function FollowersModal({ params: { handle } }: Props) {
  const currentUser = await getCurrentUserOrThrow()
  const initialUsers = await getUserFollowers(handle)

  return (
    <Modal title='Followers'>
      <UserList<LoaderType<typeof getUserFollowers>>
        route={`/api/${handle}/followers/?f=1`}
        currentUser={currentUser}
        initialUsers={initialUsers}
        inModal
      />
    </Modal>
  )
}
