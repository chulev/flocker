import { cva, cx, type VariantProps } from 'class-variance-authority'
import LoadingIcon from 'public/loading.svg'
import { forwardRef } from 'react'

const variants = cva('flex items-center p-2 w-fit', {
  variants: {
    variant: {
      primary: 'text-pure bg-sky rounded-md disabled:opacity-50 shadow',
      secondary:
        'text-charcoal hover:rounded-md hover:bg-foggy disabled:hover:bg-pure',
      warning: 'text-scarlet hover:rounded-md hover:bg-scarlet hover:text-pure',
      ghost: 'text-charcoal hover:text-ashen',
      highlight: 'text-sky hover:bg-foggy hover:rounded-md disabled:opacity-50',
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

export type VariantsProps = VariantProps<typeof variants>

type BaseButtonProps = React.ComponentPropsWithRef<'button'> &
  VariantsProps & {
    isLoading?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    { children, className, disabled, variant, size, isLoading, ...rest },
    ref
  ) => {
    return (
      <button
        {...rest}
        ref={ref}
        className={cx(variants({ variant, size }), className)}
        disabled={disabled || isLoading}
      >
        {isLoading && <LoadingIcon className='mr-2' />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
