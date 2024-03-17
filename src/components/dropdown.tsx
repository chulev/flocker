'use client'

import { cx } from 'class-variance-authority'
import { useState } from 'react'

import { useClickOutside } from '@/hooks/use-click-outside'
import { getSlots } from '@/lib/slots'

type Props = {
  className?: string
  closeOnSelect?: boolean
  children: React.ReactNode
}

export const Dropdown = ({
  children,
  className,
  closeOnSelect = false,
}: Props) => {
  const [open, setOpen] = useState(false)
  const ref = useClickOutside(() => setOpen(false))
  const slots = getSlots(children, { trigger: 'Trigger', content: 'Content' })

  return (
    <div ref={ref} className='relative'>
      <div
        className={cx('hover:rounded-md hover:bg-foggy', {
          'rounded-md bg-foggy': open,
        })}
        onClick={() => setOpen((open) => !open)}
      >
        {slots.trigger}
      </div>
      {open && (
        <div
          className={cx(
            'absolute z-10 mt-1 flex flex-col rounded-md border border-mist bg-pure p-2',
            className
          )}
          onClick={() => (closeOnSelect ? setOpen(false) : {})}
        >
          {slots.content}
        </div>
      )}
    </div>
  )
}

const Trigger = ({ children }: { children: React.ReactNode }) => children
Trigger.displayName = 'Trigger'
const Content = ({ children }: { children: React.ReactNode }) => children
Content.displayName = 'Content'

Dropdown.Trigger = Trigger
Dropdown.Content = Content
