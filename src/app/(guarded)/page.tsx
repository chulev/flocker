import type { Metadata } from 'next/types'

import PeopleIcon from 'public/people.svg'

import { TweetComposer } from '@/app/(guarded)/_components/tweet-composer'
import { TweetList } from '@/components/tweet/list'
import { fetchHomeTweets } from '@/data/tweet'
import { getCurrentUserOrThrow } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

import { SidebarLayout } from './_components/sidebar-layout'
import { Trending } from './_components/trending'

export const metadata: Metadata = {
  title: 'Home | Flocker',
  description: 'Be social',
}

export default async function HomePage() {
  const currentUser = await getCurrentUserOrThrow()
  const initialTweets = await fetchHomeTweets()

  return (
    <SidebarLayout>
      <SidebarLayout.Sidebar>
        <Trending />
      </SidebarLayout.Sidebar>
      <SidebarLayout.Content>
        <div className='grid gap-3'>
          <TweetComposer />
          {initialTweets.data.length > 0 && (
            <div className='flex items-center text-sm text-charcoal'>
              <PeopleIcon className='mr-1' />
              Tweets by users you follow
            </div>
          )}
          <TweetList<LoaderType<typeof fetchHomeTweets>>
            route='/api/tweets?filter=home'
            currentUser={currentUser}
            initialTweets={initialTweets}
          />
        </div>
      </SidebarLayout.Content>
    </SidebarLayout>
  )
}
