export const UserCardSkeleton = ({ count = 2 }: { count?: number }) =>
  [...Array(count)].map((_, idx) => (
    <div
      key={idx}
      className='mx-auto my-4 flex w-full animate-pulse flex-col rounded-md bg-pure p-4 shadow'
    >
      <div className='mb-2 flex'>
        <div className='h-10 w-10 rounded-md bg-mist' />
        <div className='ml-2 flex flex-col space-y-3 py-1'>
          <div className='h-2 w-24 rounded bg-mist' />
          <div className='h-2 w-24 rounded bg-mist' />
        </div>
      </div>
      <div className='flex w-full flex-col space-y-2'>
        <div className='h-2 w-full rounded bg-mist' />
        <div className='h-2 w-full rounded bg-mist' />
      </div>
    </div>
  ))
