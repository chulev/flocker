import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { cache } from 'react'

import { db } from '@/lib/db/client'
import { SIGN_IN_PATH } from '@/routes'

import { KyselyAdapter } from './adapter'

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: SIGN_IN_PATH,
  },
  events: {
    async linkAccount({ user }) {
      const newUser = await db
        .updateTable('User')
        .set({
          emailVerified: new Date(),
        })
        .where('id', '=', user.id)
        .returning('handle')
        .executeTakeFirst()
    },
  },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      session.user.name = token.name
      session.user.email = token.email as string
      session.user.handle = token.handle as string
      session.user.image = token.image as string
      session.user.cover = token.cover as string
      session.user.description = token.description as string

      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (!token.sub) return token
      if (trigger === 'update' && session.user) {
        token.name = session.user.name
        token.email = session.user.email
        token.handle = session.user.handle
        token.image = session.user.image
        token.cover = session.user.cover
        token.description = session.user.description

        return token
      }

      const existingUser = await db
        .selectFrom('User')
        .select(['name', 'email', 'image', 'handle', 'cover', 'description'])
        .where('id', '=', user?.id)
        .executeTakeFirst()

      if (!existingUser) return token

      token.name = existingUser.name
      token.email = existingUser.email
      token.handle = existingUser.handle
      token.image = existingUser.image
      token.cover = existingUser.cover
      token.description = existingUser.description

      return token
    },
  },
  providers: [Google],
  session: { strategy: 'jwt' },
  adapter: KyselyAdapter(db),
})

export const getCurrentUser = cache(async () => {
  const session = await auth()

  if (!session?.user) return null

  return session.user
})

export const getCurrentUserOrThrow = async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) throw Error('Not authenticated')

  return currentUser
}

export const fetchUser = cache(async () => {
  const currentUser = await getCurrentUser()

  if (!currentUser) return null

  return await db
    .selectFrom('User')
    .select([
      'name',
      'email',
      'image',
      'handle',
      'cover',
      'description',
      'theme',
    ])
    .where('id', '=', currentUser.id)
    .executeTakeFirst()
})
