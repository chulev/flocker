import { useCallback, useEffect, useRef, useState, useTransition } from 'react'

import { filterUnique } from '@/lib/filter-unique'
import type { CursorType, PaginatedResponse } from '@/lib/types'
import { DEFAULT_LIMIT } from '@/lib/validations'

type Params<T extends { id?: string; handle?: string }> = {
  initialData?: PaginatedResponse<T>
  route: string
  limit?: number
  manual?: boolean
}

export const useInfiniteLoader = <T extends { id?: string; handle?: string }>({
  initialData = { data: [], nextCursor: null },
  route,
  limit = DEFAULT_LIMIT,
  manual = false,
}: Params<T>) => {
  const [data, setData] = useState<T[]>(initialData.data)
  const [isError, setError] = useState(false)
  const [nextCursor, setNextCursor] = useState<CursorType>(
    initialData.nextCursor
  )
  const [isLoading, startTransition] = useTransition()
  const observer = useRef<IntersectionObserver | null>(null)
  const sentryRef = useRef<HTMLDivElement | null>(null)

  const fetchMore = useCallback(() => {
    if (nextCursor === null || isLoading) return
    if (isError) setError(false)

    startTransition(async () => {
      try {
        const url = `${route}&nextCursor=${nextCursor}&limit=${limit}`
        const response: PaginatedResponse<T> = await fetch(url).then((res) => {
          if (!res.ok) throw Error('Fetch error')

          return res.json()
        })

        setData((prevData) => filterUnique([...prevData, ...response.data]))
        setNextCursor(response.nextCursor)
      } catch (_) {
        setError(true)
      }
    })
  }, [route, limit, nextCursor, isLoading, isError])

  useEffect(() => {
    if (!manual) {
      observer.current = new IntersectionObserver(
        ([target]) => target.isIntersecting && !isError && fetchMore(),
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.5,
        }
      )

      if (sentryRef.current) {
        observer.current.observe(sentryRef.current)
      }
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [fetchMore, isError, manual])

  return {
    data,
    setData,
    isError,
    isLoading,
    hasMore: !!nextCursor,
    fetchMore,
    sentryRef,
  }
}
