import { Link } from '@/components/link'

export const Footer = () => (
  <footer className='flex justify-center py-2'>
    <span className='text-sm text-charcoal'>
      created by{' '}
      <Link target='_blank' variant='ghost' href='https://github.com/chulev'>
        chulev
      </Link>
    </span>
  </footer>
)
