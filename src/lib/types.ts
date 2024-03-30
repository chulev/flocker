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

export type Reply = {
  content: string
  id: string
  userName: string
  userImage: string | null
  userHandle: string
  imgPath: string | null
  likeCount: string
  liked: boolean
}

export type EnrichedReply = Reply & { date: string }

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
  following: boolean
}

export type EnrichedTweet = Tweet & {
  date: string
  replies: PaginatedResponse<EnrichedReply>
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
