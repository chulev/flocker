import { type NextRequest, NextResponse } from 'next/server'

import { toSSE } from '@/lib/sse'
import { getSubscribeClient } from '@/lib/store/client'
import { MAIN_CHANNEL_KEY } from '@/lib/validations'

export const dynamic = 'force-dynamic'

const client = await getSubscribeClient()

export async function GET(request: NextRequest) {
  const responseStream = new TransformStream()
  const writer = responseStream.writable.getWriter()
  const encoder = new TextEncoder()

  const listener = (message: string, channel: string) => {
    if (channel === MAIN_CHANNEL_KEY) {
      writer.write(encoder.encode(message))
    }
  }

  request.signal.addEventListener('abort', async () => {
    await writer.close()
    await client.unsubscribe(MAIN_CHANNEL_KEY, listener)
  })

  writer.write(
    encoder.encode(toSSE({ type: 'PING', data: { content: 'PING' } }))
  )
  await client.subscribe(MAIN_CHANNEL_KEY, listener)

  return new NextResponse(responseStream.readable, {
    headers: {
      'Content-Encoding': 'none',
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/event-stream',
    },
  })
}
