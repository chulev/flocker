export type CursorType = string | null

export type Order = 'asc' | 'desc'

export type PaginatedResponse<T> = {
  data: T[]
  nextCursor: CursorType
}

export type ResultType<T extends any[]> = T[number]

export type LoaderType<T extends (...args: any[]) => any> = Awaited<
  ReturnType<T>
>['data'][number]

export type Tweet = {
  content: string
  followerOnly: boolean
  id: string
  retweetId: string | null
  userName: string | null
  userImage: string | null
  userHandle: string | null
  retweeterName: string | null
  retweeterHandle: string | null
  imgPath: string | null
  replyCount: string
  retweetCount: string
  likeCount: string
  bookmarkCount: string
}

export type EnrichedTweet = Tweet & {
  date: string
  reactions: {
    retweeted: boolean
    liked: boolean
    saved: boolean
  }
}

export type UserCard = {
  handle: string
  description: string | null
  image: string | null
  name: string
  followersCount: string
  following: boolean
}
