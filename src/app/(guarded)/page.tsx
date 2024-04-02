import { Metadata } from 'next/types'

import { TweetComposer } from '@/app/(guarded)/_components/tweet-composer'

import { SidebarLayout } from './_components/sidebar-layout'
import { Trending } from './_components/trending'

export const metadata: Metadata = {
  title: 'Home | Flocker',
  description: 'Be social',
}

export default async function HomePage() {
  return (
    <SidebarLayout>
      <SidebarLayout.Sidebar>
        <Trending />
      </SidebarLayout.Sidebar>
      <SidebarLayout.Content>
        <div className='grid gap-3'>
          <TweetComposer />
        </div>
      </SidebarLayout.Content>
    </SidebarLayout>
  )
}
