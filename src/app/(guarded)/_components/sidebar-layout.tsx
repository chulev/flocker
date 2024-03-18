import { cx } from 'class-variance-authority'

import { getSlots } from '@/lib/slots'

type Props = {
  children: React.ReactNode
  pos?: 'left' | 'right'
  hide?: boolean
}

export const SidebarLayout = ({
  children,
  pos = 'left',
  hide = true,
}: Props) => {
  const slots = getSlots(children, { sidebar: 'Sidebar', content: 'Content' })

  return (
    <section
      className={cx(
        'my-4 grid gap-2',
        {
          'max-sm:grid-cols-[5px_1fr_5px] sm:grid-cols-[1fr_5fr_1fr] md:grid-cols-[1fr_8fr_1fr] lg:grid-cols-[1fr_770px_1fr]':
            pos === 'left',
        },
        {
          'max-sm:grid-cols-[5px_1fr_5px] sm:grid-cols-[1fr_5fr_1fr] md:grid-cols-[1fr_5fr_3fr_1fr] lg:grid-cols-[1fr_770px_1fr]':
            pos === 'right',
        }
      )}
    >
      <div className={cx('w-full', pos === 'right' && 'order-1')} />
      <div className='grid gap-2 max-sm:grid-cols-[1fr] sm:grid-cols-[1fr] md:grid-cols-[3fr_5fr] lg:grid-cols-[270px_500px]'>
        <section
          className={cx(
            'min-w-0',
            pos === 'right' && 'order-3',
            hide && 'max-md:hidden'
          )}
        >
          {slots.sidebar}
        </section>
        <main className={cx(pos === 'right' && 'order-2')}>
          {slots.content}
        </main>
      </div>
      <div className={cx('w-full', pos === 'right' && 'order-4')} />
    </section>
  )
}

const Sidebar = ({ children }: { children: React.ReactNode }) => <>{children}</>
Sidebar.displayName = 'Sidebar'

SidebarLayout.Sidebar = Sidebar

const Content = ({ children }: { children: React.ReactNode }) => <>{children}</>
Content.displayName = 'Content'

SidebarLayout.Content = Content
