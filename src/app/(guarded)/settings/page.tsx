import { Metadata } from 'next/types'

import { SidebarLayout } from '@/app/(guarded)/_components/sidebar-layout'
import { fetchUser } from '@/lib/auth'

import { Settings } from './_components/settings'

export const metadata: Metadata = {
  title: 'Settings | Flocker',
  description: 'Be social',
}

export default async function SettingsPage() {
  const currentUser = await fetchUser()

  return (
    <SidebarLayout>
      <SidebarLayout.Content>
        <Settings currentUser={currentUser} />
      </SidebarLayout.Content>
    </SidebarLayout>
  )
}
