'use client'

import { cx } from 'class-variance-authority'
import { usePathname } from 'next/navigation'

import { Link, type LinkProps } from './link'

type ActiveLinkProps = LinkProps & {
  matchPartialPath?: boolean
}

export const ActiveLink = ({
  className,
  href,
  matchPartialPath = false,
  ...rest
}: ActiveLinkProps) => {
  const pathname = usePathname()
  const isActive = matchPartialPath
    ? pathname.startsWith(href.toString())
    : pathname === href

  return (
    <Link
      className={cx(isActive && cx('pointer-events-none', className))}
      href={href}
      {...rest}
    />
  )
}
