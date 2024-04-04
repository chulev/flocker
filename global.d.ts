import { RedisClientType } from '@redis/client'

declare global {
  var subscribeClient: RedisClientType
  var publishClient: RedisClientType
}
