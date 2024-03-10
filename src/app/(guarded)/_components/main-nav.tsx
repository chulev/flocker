import { ActiveLink } from '@/components/active-link'

const ACTIVE_CLASS_NAME = 'text-sky border-b-4 border-b-sky pb-2'

export const MainNav = () => (
  <nav className='flex h-full items-center max-md:hidden'>
    <ActiveLink className={ACTIVE_CLASS_NAME} variant='secondary' href='/'>
      Home
    </ActiveLink>
    <ActiveLink
      className={ACTIVE_CLASS_NAME}
      variant='secondary'
      href='/explore'
      matchPartialPath
    >
      Explore
    </ActiveLink>
    <ActiveLink
      className={ACTIVE_CLASS_NAME}
      variant='secondary'
      href='/bookmarks'
      matchPartialPath
    >
      Bookmarks
    </ActiveLink>
  </nav>
)
