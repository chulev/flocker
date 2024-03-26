import { cx } from 'class-variance-authority'
import { notFound } from 'next/navigation'

import { ActiveLink } from '@/components/active-link'
import { Avatar } from '@/components/avatar'
import { Image } from '@/components/image'
import { getUserProfileByHandle } from '@/data/user'
import { getCurrentUser } from '@/lib/auth'

import { SidebarLayout } from '../../_components/sidebar-layout'

const ACTIVE_CLASS_NAME = 'text-sky border-l-4 border-l-sky pb-3 pl-2'

type Props = {
  children: React.ReactNode
  params: { handle: string }
}

export default async function UserLayout({
  params: { handle },
  children,
}: Props) {
  const currentUser = await getCurrentUser()
  const user = await getUserProfileByHandle(handle)

  if (!user || !currentUser) notFound()

  return (
    <>
      <section className='grid grid-rows-[auto_1fr]'>
        <div
          className={cx(
            'relative',
            { 'h-60 max-md:h-48': user.cover },
            { 'h-24 max-md:h-20': !user.cover }
          )}
        >
          {user.cover && (
            <Image
              fill
              className='object-cover'
              sizes='50vw'
              src={user.cover}
              alt='Cover'
            />
          )}
        </div>
        <section className='grid grid-rows-[auto_1fr]'>
          <section className='z-10 grid gap-2 max-sm:grid-cols-[5px_1fr_5px] sm:grid-cols-[1fr_5fr_1fr] md:grid-cols-[1fr_8fr_1fr] lg:grid-cols-[1fr_770px_1fr]'>
            <div className='w-full' />
            <section className='flex rounded-md bg-pure px-4 py-6 shadow max-sm:flex-col max-sm:items-center'>
              <Avatar
                className='-mt-20 mb-4'
                src={user.image}
                variant='lg'
                alt={user.name}
              />
              <div className='flex w-full flex-wrap justify-between max-sm:flex-col max-sm:justify-center sm:ml-4'>
                <div className='flex flex-col md:w-5/6'>
                  <div className='mb-4 flex flex-wrap max-sm:flex-col'>
                    <span className='text-lg text-charcoal max-sm:text-center max-sm:text-md md:mr-4'>
                      {user.name} {currentUser.id === user.id && '(You)'}
                    </span>
                  </div>
                  {user.description && (
                    <span className='mb-4 text-sm text-charcoal max-sm:text-center'>
                      {user.description}
                    </span>
                  )}
                </div>
              </div>
            </section>
            <div className='w-full' />
          </section>
          <SidebarLayout hide={false}>
            <SidebarLayout.Sidebar>
              <nav className='sticky top-[80px] rounded-md bg-pure py-1 shadow max-md:flex'>
                <ActiveLink
                  className={ACTIVE_CLASS_NAME}
                  variant='tertiary'
                  href={`/user/${handle}`}
                >
                  Tweets
                </ActiveLink>
                <ActiveLink
                  className={ACTIVE_CLASS_NAME}
                  variant='tertiary'
                  href={`/user/${user.handle}/replies`}
                >
                  Replies
                </ActiveLink>
                <ActiveLink
                  className={ACTIVE_CLASS_NAME}
                  variant='tertiary'
                  href={`/user/${user.handle}/media`}
                >
                  Media
                </ActiveLink>
                <ActiveLink
                  className={ACTIVE_CLASS_NAME}
                  variant='tertiary'
                  href={`/user/${user.handle}/likes`}
                >
                  Likes
                </ActiveLink>
              </nav>
            </SidebarLayout.Sidebar>
            <SidebarLayout.Content>{children}</SidebarLayout.Content>
          </SidebarLayout>
        </section>
      </section>
    </>
  )
}
