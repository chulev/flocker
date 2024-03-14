import { cx } from 'class-variance-authority'

import ErrorIcon from 'public/error.svg'

type Props = {
  className?: string
  message: string
}

export const FormError = ({ className, message }: Props) => (
  <div className={cx('flex items-center text-xs text-scarlet', className)}>
    <ErrorIcon />
    <span className='ml-1'>{message}</span>
  </div>
)
