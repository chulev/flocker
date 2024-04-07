import FlockerIcon from 'public/flocker.svg'

import { ActiveLink } from '@/components/active-link'

type Props = {
  withHomeLink?: boolean
}

export const Logo = ({ withHomeLink = false }: Props) => (
  <div className='flex items-center justify-center text-lg text-charcoal'>
    {withHomeLink ? (
      <ActiveLink href='/' aria-label='Home'>
        <FlockerIcon className='h-8 w-8' />
      </ActiveLink>
    ) : (
      <FlockerIcon className='h-8 w-8' />
    )}
    <span className='ml-2 max-sm:hidden'>Flocker</span>
  </div>
)
