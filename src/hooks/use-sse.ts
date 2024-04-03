import { useContext, useEffect, useRef } from 'react'

import { SSEContext } from '@/app/_components/sse-provider'
import type { EventMap as EventMapType } from '@/lib/types'

type EventMap<T> = {
  [K in keyof T]?: (data: T[K]) => void
}

const listener =
  <T>(callback: (data: T) => void) =>
  (event: MessageEvent<any>) => {
    const data = JSON.parse(event.data) as T
    callback(data)
  }

export const useSSE = <T extends EventMapType>(eventMap: EventMap<T>) => {
  const { source } = useContext(SSEContext)
  const listenerMap = useRef<
    Record<string, (event: MessageEvent<any>) => void>
  >({})

  useEffect(() => {
    if (!source) return

    for (const [key, callback] of Object.entries(eventMap)) {
      const eventListener = listener(callback)
      listenerMap.current[key] = eventListener
      source.addEventListener(key, listenerMap.current[key])
    }

    return () => {
      for (const [key, _] of Object.entries(eventMap)) {
        source.removeEventListener(key, listenerMap.current[key])
      }
      listenerMap.current = {}
    }
  }, [source, eventMap])
}
