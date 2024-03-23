import { useCallback, useEffect, useRef, useState } from 'react'

export const useOptimisticAction = (
  initialState: boolean,
  action: (state: boolean) => Promise<void>
) => {
  const [state, setState] = useState(initialState)
  const isActionPending = useRef(false)

  useEffect(() => {
    setState(initialState)
  }, [initialState])

  const callback = useCallback(async () => {
    if (isActionPending.current) return

    setState((state) => !state)

    isActionPending.current = true

    try {
      await action(!state)
    } catch {
      setState(state)
    } finally {
      isActionPending.current = false
    }
  }, [action, state])

  return [state, callback] as const
}
