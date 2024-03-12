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

export interface DB {
  Account: Account
  ResetPasswordToken: ResetPasswordToken
  User: User
  VerificationToken: VerificationToken
}
