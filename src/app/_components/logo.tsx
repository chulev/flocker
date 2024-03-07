import FlockerIcon from 'public/flocker.svg'

export const Logo = () => (
  <div className='text-charcoal flex items-center justify-center text-lg'>
    <FlockerIcon className='h-8 w-8' />
    <span className='ml-2 max-sm:hidden'>Flocker</span>
  </div>
)
