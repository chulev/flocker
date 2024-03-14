import { useInsertionEffect, useRef } from 'react'

export const useEvent = <TCallback extends (...args: any[]) => any>(
  callback: TCallback
): TCallback => {
  const latestRef = useRef<TCallback>(null as any)
  useInsertionEffect(() => {
    latestRef.current = callback
  }, [callback])

  const stableRef = useRef<TCallback>(null as any)
  if (!stableRef.current) {
    stableRef.current = function (this: any) {
      return latestRef.current.apply(this, arguments as any)
    } as TCallback
  }

  return stableRef.current
}
