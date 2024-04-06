type WindowEntry = {
  timestamp: number
  count: number
}

type SlidingWindowConfig = {
  windowSize: number
  limit: number
}

const rateLimiter = (config: SlidingWindowConfig) => {
  const ipMap: Map<string, WindowEntry> = new Map<string, WindowEntry>()

  return (ip: string) => {
    const now = Date.now()
    const windowStart = now - config.windowSize

    for (const [key, entry] of ipMap) {
      if (entry.timestamp < windowStart) {
        ipMap.delete(key)
      }
    }

    let entry = ipMap.get(ip)
    if (!entry) {
      entry = { timestamp: now, count: 0 }
      ipMap.set(ip, entry)
    } else {
      ipMap.set(ip, { ...entry, count: ++entry.count })
    }

    return entry.count > config.limit
  }
}

export default rateLimiter({ windowSize: 60000, limit: 20 })
