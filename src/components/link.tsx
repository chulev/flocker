import { type VariantProps, cva, cx } from 'class-variance-authority'
import BaseLink, { type LinkProps as BaseLinkProps } from 'next/link'

const variants = cva('cursor-pointer', {
  variants: {
    variant: {
      primary:
        'flex items-center text-charcoal hover:rounded-md hover:bg-foggy p-2 font-normal',
      secondary:
        'mx-4 text-charcoal flex h-full items-center hover:text-sky hover:border-b-4 hover:border-b-sky px-2 py-3 hover:pb-2',
      tertiary:
        'flex text-charcoal items-center p-3 hover:border-l-4 hover:border-l-sky hover:pl-2 hover:text-sky max-md:flex-1 max-md:justify-center',
      quaternary:
        'flex items-center p-2 text-pure bg-sky rounded-md disabled:opacity-50',
      ghost: 'text-charcoal hover:text-ashen',
      highlight: 'text-sky',
    },
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'sm',
  },
})

export type LinkProps = BaseLinkProps &
  React.ComponentPropsWithoutRef<'a'> &
  VariantProps<typeof variants> & {
    className?: string
    children: React.ReactNode
  }

export const Link = ({ className, variant, size, ...rest }: LinkProps) => (
  <BaseLink {...rest} className={cx(variants({ variant, size }), className)} />
)
