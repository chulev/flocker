import { ForwardedRef, useEffect, useRef } from 'react'

export const useCopyRef = <T>(
  ref: ForwardedRef<T>,
  initialValue: any = null
) => {
  const targetRef = useRef<T>(initialValue)

  useEffect(() => {
    if (!ref) return

    if (typeof ref === 'function') {
      ref(targetRef.current)
    } else {
      ref.current = targetRef.current
    }
  }, [ref])

  return targetRef
}
