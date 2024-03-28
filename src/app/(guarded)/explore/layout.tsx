import { ActiveLink } from '@/components/active-link'

import { SidebarLayout } from '../_components/sidebar-layout'

const ACTIVE_CLASS_NAME = 'text-sky border-l-4 border-l-sky pb-3 pl-2'

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarLayout hide={false}>
      <SidebarLayout.Sidebar>
        <nav className='sticky top-[80px] rounded-md bg-pure py-1 shadow max-md:flex'>
          <ActiveLink
            className={ACTIVE_CLASS_NAME}
            variant='tertiary'
            href='/explore'
          >
            Top
          </ActiveLink>
          <ActiveLink
            className={ACTIVE_CLASS_NAME}
            variant='tertiary'
            href='/explore/latest'
          >
            Latest
          </ActiveLink>
          <ActiveLink
            className={ACTIVE_CLASS_NAME}
            variant='tertiary'
            href='/explore/people'
          >
            People
          </ActiveLink>
          <ActiveLink
            className={ACTIVE_CLASS_NAME}
            variant='tertiary'
            href='/explore/media'
          >
            Media
          </ActiveLink>
        </nav>
      </SidebarLayout.Sidebar>
      <SidebarLayout.Content>{children}</SidebarLayout.Content>
    </SidebarLayout>
  )
}
