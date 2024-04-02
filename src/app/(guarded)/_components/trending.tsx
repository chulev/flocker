import { Divider } from '@/components/divider'
import { Link } from '@/components/link'
import { UserList } from '@/components/user/list'
import { fetchTrendingHashtags } from '@/data/hashtag'
import { fetchWhoToFollow } from '@/data/user'
import { getCurrentUser } from '@/lib/auth'
import type { LoaderType } from '@/lib/types'

import { HashtagCounter } from './hashtag-counter'

export const Trending = async () => {
  const currentUser = await getCurrentUser()
  const hashtags = await fetchTrendingHashtags()
  const initialUsers = await fetchWhoToFollow()

  return (
    <div>
      <section className='mb-4 flex flex-col rounded-md bg-pure p-2 shadow'>
        <span className='text-sm text-charcoal'>Trends for you</span>
        <Divider />
        {hashtags.length > 0 ? (
          hashtags.map((hashtag) => (
            <div key={hashtag.value} className='my-1 flex flex-col'>
              <Link
                className='truncate text-md text-charcoal'
                variant='ghost'
                size='md'
                href={`/hashtag/${hashtag.value}`}
              >
                #{hashtag.value}
              </Link>
              <span className='truncate text-xs text-ashen'>
                <HashtagCounter
                  hashtag={hashtag.value}
                  tweetCount={hashtag.tweetCount}
                />
              </span>
            </div>
          ))
        ) : (
          <span className='text-xs text-charcoal'>
            No trending hashtags at the moment. Check again later.
          </span>
        )}
      </section>
      <section className='flex flex-col rounded-md bg-pure p-2 shadow'>
        <span className='text-sm text-charcoal'>Who to follow</span>
        <Divider />
        {initialUsers.data.length > 0 && currentUser ? (
          <UserList<LoaderType<typeof fetchWhoToFollow>>
            route='/api/people/follow?f=1'
            limit={5}
            manual
            currentUser={currentUser}
            initialUsers={initialUsers}
          />
        ) : (
          <span className='text-xs text-charcoal'>
            No users to follow at this moment. Check again later.
          </span>
        )}
      </section>
    </div>
  )
}
