import { Logo } from '@/app/_components/logo'

export const Header = async () => {
  return (
    <header className='full bg-pure sticky top-0 z-20 flex h-full w-full items-center justify-between px-2 shadow'>
      <Logo />
    </header>
  )
}
