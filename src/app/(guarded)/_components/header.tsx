import { Logo } from '@/app/_components/logo'
import { ThemePicker } from '@/components/theme-picker'
import { UserMenu } from '@/components/user/menu'
import { fetchUser } from '@/lib/auth'

import { MainNav } from './main-nav'

export const Header = async () => {
  const currentUser = await fetchUser()

  if (!currentUser) return null

  return (
    <header className='full sticky top-0 z-20 flex h-full w-full items-center justify-between bg-pure px-2 shadow'>
      <Logo withHomeLink />
      <MainNav />
      <div className='flex items-center gap-2'>
        <ThemePicker theme={currentUser.theme} />
        <UserMenu
          name={currentUser.name}
          handle={currentUser.handle}
          image={currentUser.image}
        />
      </div>
    </header>
  )
}
