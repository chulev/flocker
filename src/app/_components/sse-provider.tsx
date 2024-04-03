'use client'

import { createContext, useEffect, useState } from 'react'

type SSE = {
  source: EventSource | null
}

export const SSEContext = createContext<SSE>({
  source: null,
})

type Props = {
  url: string
  children: React.ReactNode
}

export const SSEProvider = ({ url, children }: Props) => {
  const [source, setSource] = useState<EventSource | null>(null)

  useEffect(() => {
    const connectToSource = () => {
      const eventSource = new EventSource(url, { withCredentials: true })

      eventSource.addEventListener('open', () => {
        setSource(eventSource)
      })

      eventSource.addEventListener('error', () => {
        eventSource.close()
        setTimeout(connectToSource, 1)
      })

      eventSource.addEventListener('close', () => {
        eventSource.close()
        setTimeout(connectToSource, 1)
      })

      return eventSource
    }

    const connection = connectToSource()

    return () => {
      setSource(null)
      connection.close()
    }
  }, [url])

  return (
    <SSEContext.Provider value={{ source }}>{children}</SSEContext.Provider>
  )
}
