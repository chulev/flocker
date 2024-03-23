import type { PaginatedResponse } from './types'

export const paginate = <T extends { id: string }>(
  data: T[],
  limit: number
): PaginatedResponse<T> => {
  return {
    data: data.slice(0, limit),
    nextCursor: data?.[limit]?.id ?? null,
  }
}
