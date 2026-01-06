'use client'

import { useRouter } from 'next/navigation'
import CloseIcon from 'public/close.svg'
import { useCallback, useEffect } from 'react'

import { useClickOutside } from '@/hooks/use-click-outside'

import { Button } from './button'
import { Divider } from './divider'

type Props = {
  title: string
  children: React.ReactNode
}

export const Modal = ({ title, children }: Props) => {
  const router = useRouter()
  const goBack = useCallback(() => router.back(), [router])
  const ref = useClickOutside(goBack)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className='fixed left-0 top-0 z-20 h-screen w-screen bg-ashen bg-opacity-50'>
      <div
        ref={ref}
        className='fixed left-1/2 top-1/2 flex h-3/4 -translate-x-1/2 -translate-y-1/2 flex-col rounded-md bg-foggy p-4 max-sm:w-11/12 sm:w-3/4 md:w-1/2 lg:w-[500px]'
      >
        <div className='flex items-center justify-between'>
          <span className='text-sm text-charcoal'>{title}</span>
          <Button variant='secondary' onClick={goBack} aria-label='Close'>
            <CloseIcon />
          </Button>
        </div>
        <Divider />
        <div className='overflow-y-auto'>{children}</div>
      </div>
    </div>
  )
}
