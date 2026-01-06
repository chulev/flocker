import { Metadata } from 'next/types'

import { Modal } from '@/components/modal'
import { UserList } from '@/components/user/list'
import { getUserFollowing } from '@/data/user'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

type Props = {
  params: Promise<{
    handle: string
  }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params

  const { handle } = params

  return {
    title: `${handle} Following | Flocker`,
    description: 'Be social',
  }
}

export default async function FollowingModal(props: Props) {
  const params = await props.params

  const { handle } = params

  const currentUser = await getCurrentUserOrThrow()
  const initialUsers = await getUserFollowing(handle)

  return (
    <Modal title='Following'>
      <UserList<LoaderType<typeof getUserFollowing>>
        route={`/api/${handle}/following/?f=1`}
        currentUser={currentUser}
        initialUsers={initialUsers}
        inModal
      />
    </Modal>
  )
}
