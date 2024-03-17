import { useEffect, useRef } from 'react'

export const useClickOutside = (
  onClickOutside: (event: MouseEvent) => void
) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      ref.current &&
        !ref.current.contains(event.target as Node) &&
        onClickOutside(event)
    }

    document.addEventListener('mousedown', handler)

    return () => {
      document.removeEventListener('mousedown', handler)
    }
  }, [ref, onClickOutside])

  return ref
}
