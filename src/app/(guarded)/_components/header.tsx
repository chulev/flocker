import { Logo } from '@/app/_components/logo'

import { MainNav } from './main-nav'

export const Header = async () => {
  return (
    <header className='full bg-pure sticky top-0 z-20 flex h-full w-full items-center justify-between px-2 shadow'>
      <Logo />
      <MainNav />
    </header>
  )
}
