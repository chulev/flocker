import { type VariantProps, cva, cx } from 'class-variance-authority'

const variants = cva('flex text-charcoal bg-foggy w-full', {
  variants: {
    variant: {
      primary: 'my-3 h-auto rounded-md p-2 text-md',
      secondary: 'px-2 text-sm focus:outline-none',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type Props = React.ComponentPropsWithRef<'input'> &
  VariantProps<typeof variants> & {
    lengthLimit?: number
    withLabel?: boolean
  }

export const Input = ({
  className,
  name,
  value,
  placeholder,
  variant,
  lengthLimit,
  withLabel = true,
  ...rest
}: Props) => {
  return (
    <>
      {name && placeholder && withLabel && (
        <div className='mt-2 flex justify-between text-sm font-medium text-charcoal'>
          <label htmlFor={name}>{placeholder}</label>
          {lengthLimit && typeof value === 'string' && (
            <span
              className={cx(
                'mx-2',
                value?.length > lengthLimit && 'text-scarlet'
              )}
            >{`${value.length}/${lengthLimit}`}</span>
          )}
        </div>
      )}
      <input
        {...rest}
        name={name}
        value={value}
        placeholder={placeholder}
        className={cx(variants({ variant }), className)}
      />
    </>
  )
}

Input.displayName = 'Input'
