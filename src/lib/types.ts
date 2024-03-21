export type CursorType = string | null

export type PaginatedResponse<T> = {
  data: T[]
  nextCursor: CursorType
}
