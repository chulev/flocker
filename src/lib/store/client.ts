import { RedisClientType, createClient } from '@redis/client'

import { toSSE } from '../sse'
import type { EventMap } from '../types'
import { MAIN_CHANNEL_KEY } from '../validations'

let subscribeClient: RedisClientType
let publishClient: RedisClientType

export const getSubscribeClient = async () => {
  if (global.subscribeClient) return global.subscribeClient

  subscribeClient = createClient({
    url: process.env.REDIS_URL,
  })
  await subscribeClient.connect()

  global.subscribeClient = subscribeClient

  return subscribeClient
}

export const getPublishClient = async () => {
  if (global.publishClient) return global.publishClient

  publishClient = createClient({
    url: process.env.REDIS_URL,
  })
  await publishClient.connect()

  global.publishClient = publishClient

  return publishClient
}

export const publish = async <K extends keyof EventMap>(
  channel: typeof MAIN_CHANNEL_KEY,
  event: { id?: string; type?: K; data: EventMap[K] }
) => {
  const client = await getPublishClient()

  await client.publish(channel, toSSE(event))
}
