import { Metadata } from 'next/types'

import { UserList } from '@/components/user/list'
import { fetchPeople } from '@/data/user'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

export const metadata: Metadata = {
  title: 'People | Flocker',
  description: 'Be social',
}

export default async function PeoplePage() {
  const currentUser = await getCurrentUserOrThrow()
  const initialUsers = await fetchPeople()

  return (
    <UserList<LoaderType<typeof fetchPeople>>
      route='/api/people?f=1'
      currentUser={currentUser}
      initialUsers={initialUsers}
    />
  )
}
