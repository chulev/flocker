import NotExistIcon from 'public/not-exist.svg'

export const NotExist = () => (
  <section className='bg-foggy flex h-full items-center'>
    <div className='mx-auto my-2 flex flex-col items-center justify-center'>
      <NotExistIcon className='h-64 w-64 max-sm:h-32 max-sm:w-32' />
      <p className='text-md text-charcoal md:text-md mb-8 font-semibold'>
        Page not found
      </p>
    </div>
  </section>
)
