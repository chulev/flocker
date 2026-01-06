'use client'

import { cx } from 'class-variance-authority'
import RefreshIcon from 'public/refresh.svg'
import { useCallback } from 'react'

import { Button } from './button'
import { Count } from './count'

type Props = {
  className?: string
  onLoadNew: () => void
  newCount: number
  singular: string
  plural: string
}

export const LoadNew = ({
  className,
  onLoadNew,
  newCount,
  singular,
  plural,
}: Props) => {
  const loadNew = useCallback(() => {
    onLoadNew()
    window.scrollTo(0, 0)
  }, [onLoadNew])

  return (
    <Button
      className={cx('sticky z-10 w-full justify-center', className)}
      onClick={loadNew}
    >
      <RefreshIcon />
      <Count
        className='ml-2'
        count={newCount.toString()}
        singular={singular}
        plural={plural}
      />
    </Button>
  )
}
