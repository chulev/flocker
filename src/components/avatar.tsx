import { cx } from 'class-variance-authority'
import type { ImageProps } from 'next/image'

import { Image } from './image'

type Dimensions = {
  width: number
  height: number
}

type Variant = 'sm' | 'lg'

function getDimensions(variant: Variant): Dimensions {
  switch (variant) {
    case 'sm':
      return { width: 40, height: 40 }
    case 'lg':
      return { width: 176, height: 176 }
  }
}

type Props = Omit<ImageProps, 'src'> & {
  src?: string | null | undefined
  variant: Variant
}

export const Avatar = ({ src, variant, alt, className, ...rest }: Props) =>
  src ? (
    <Image
      {...rest}
      {...getDimensions(variant)}
      className={cx(
        'rounded-md object-cover',
        { 'h-10 w-10': variant === 'sm' },
        { 'h-44 w-44': variant === 'lg' },
        className
      )}
      src={src}
      alt={alt}
    />
  ) : (
    <div
      className={cx(
        'flex shrink-0 items-center justify-center rounded-md bg-sky text-pure shadow',
        { 'h-10 w-10 text-sm': variant === 'sm' },
        { 'h-44 w-44 text-xxl': variant === 'lg' },
        className
      )}
    >
      {alt
        .split(' ')
        .slice(0, 2)
        .map((word) => word.charAt(0).toUpperCase())
        .join('')}
    </div>
  )
