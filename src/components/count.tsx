import { pluralize } from '@/lib/pluralize'

type Props = {
  className?: string
  count: string
  singular: string
  plural: string
}

export const Count = ({ className, count, singular, plural }: Props) => {
  const parsedCount = parseInt(count, 10) || 0

  if (parsedCount === 0) return null

  return (
    <span className={className}>
      {pluralize(parsedCount, singular, plural)}
    </span>
  )
}
