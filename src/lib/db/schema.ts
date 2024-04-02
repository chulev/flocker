import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>

export type Int8 = ColumnType<
  string,
  bigint | number | string,
  bigint | number | string
>

export type Theme = 'dark' | 'light'

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface Account {
  access_token: string | null
  expires_at: Int8 | null
  id: Generated<string>
  id_token: string | null
  provider: string
  providerAccountId: string
  refresh_token: string | null
  scope: string | null
  session_state: string | null
  token_type: string | null
  type: string
  userId: string
}

export interface ResetPasswordToken {
  email: string
  expires: Timestamp
  id: Generated<string>
}

export interface User {
  cover: string | null
  description: string | null
  email: string
  emailVerified: Timestamp | null
  handle: Generated<string>
  id: Generated<string>
  image: string | null
  name: string
  password: string | null
  theme: Generated<Theme>
}

export interface VerificationToken {
  email: string
  expires: Timestamp
  id: Generated<string>
}

export interface Bookmark {
  id: Generated<string>
  tweetId: string
  userId: string
}

export interface Follow {
  followeeId: string
  followerId: string
  id: Generated<string>
}

export interface Hashtag {
  id: Generated<string>
  value: string
}

export interface Reply {
  content: string
  id: Generated<string>
  tweetId: string
  userId: string
}

export interface ReplyAttachment {
  id: Generated<string>
  replyId: string
  uri: string
}

export interface ReplyLike {
  id: Generated<string>
  replyId: string
  userId: string
}

export interface Tweet {
  content: string
  followerOnly: Generated<boolean>
  id: Generated<string>
  retweetId: string | null
  userId: string
}

export interface TweetAttachment {
  id: Generated<string>
  tweetId: string
  uri: string
}

export interface TweetHashtag {
  hashtagId: string
  id: Generated<string>
  tweetId: string
}

export interface TweetLike {
  id: Generated<string>
  tweetId: string
  userId: string
}

export interface DB {
  Account: Account
  Bookmark: Bookmark
  Follow: Follow
  Hashtag: Hashtag
  Reply: Reply
  ReplyAttachment: ReplyAttachment
  ReplyLike: ReplyLike
  ResetPasswordToken: ResetPasswordToken
  Tweet: Tweet
  TweetAttachment: TweetAttachment
  TweetHashtag: TweetHashtag
  TweetLike: TweetLike
  User: User
  VerificationToken: VerificationToken
}
