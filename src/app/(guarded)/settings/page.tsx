import type { Metadata } from 'next/types'

import { SidebarLayout } from '@/app/(guarded)/_components/sidebar-layout'
import { fetchUser } from '@/lib/auth'

import { Trending } from '../_components/trending'
import { Settings } from './_components/settings'

export const metadata: Metadata = {
  title: 'Settings | Flocker',
  description: 'Be social',
}

export default async function SettingsPage() {
  const currentUser = await fetchUser()

  return (
    <SidebarLayout>
      <SidebarLayout.Sidebar>
        <Trending />
      </SidebarLayout.Sidebar>
      <SidebarLayout.Content>
        <Settings currentUser={currentUser} />
      </SidebarLayout.Content>
    </SidebarLayout>
  )
}
