import { Metadata } from 'next/types'

import { TweetComposer } from '@/app/(guarded)/_components/tweet-composer'

import { SidebarLayout } from './_components/sidebar-layout'

export const metadata: Metadata = {
  title: 'Home | Flocker',
  description: 'Be social',
}

export default async function HomePage() {
  return (
    <SidebarLayout>
      <SidebarLayout.Content>
        <div className='grid gap-3'>
          <TweetComposer />
        </div>
      </SidebarLayout.Content>
    </SidebarLayout>
  )
}
