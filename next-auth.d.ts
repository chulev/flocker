import { type DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  id: string
  handle: string
  cover: string | null
  description: string | null
  theme: string
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
