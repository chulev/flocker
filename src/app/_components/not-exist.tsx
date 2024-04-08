import NotExistIcon from 'public/not-exist.svg'

import { Link } from '@/components/link'

export const NotExist = () => (
  <section className='flex h-full items-center bg-foggy'>
    <div className='mx-auto my-2 flex flex-col items-center justify-center'>
      <NotExistIcon className='h-64 w-64 max-sm:h-32 max-sm:w-32' />
      <p className='mb-8 text-md font-semibold text-charcoal md:text-md'>
        Page not found
      </p>
      <Link variant='quaternary' className='w-fit' href='/'>
        Back to Home
      </Link>
    </div>
  </section>
)
