import { Metadata } from 'next/types'

import { Trending } from '../_components/trending'

export const metadata: Metadata = {
  title: 'Trending | Flocker',
  description: 'Be social',
}

export default async function TrendingPage() {
  return (
    <section className='my-4 grid grid-cols-[1fr_5fr_1fr] gap-2 max-sm:grid-cols-[5px_1fr_5px]'>
      <div className='w-full' />
      <div className='grid gap-3'>
        <Trending />
      </div>
      <div className='w-full' />
    </section>
  )
}
