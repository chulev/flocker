import { EventMap } from './types'

export const toSSE = <K extends keyof EventMap>({
  id,
  type,
  data,
}: {
  id?: string
  type?: K
  data: EventMap[K]
}) => {
  const eventId = id ? `id: ${id}\n` : ''
  const eventType = type ? `event: ${type}\n` : ''
  const eventData =
    data !== null && typeof data === 'object'
      ? `data: ${JSON.stringify(data)}\n\n`
      : ''

  return `${eventId}${eventType}${eventData}`
}
