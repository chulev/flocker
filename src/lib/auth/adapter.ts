import type { Adapter } from '@auth/core/adapters'
import type { Kysely } from 'kysely'

import type { DB } from '../db/schema'

export function KyselyAdapter(db: Kysely<DB>): Adapter {
  return {
    async createUser(user) {
      const { id, handle } = await db
        .insertInto('User')
        .values({
          name: user.name as string,
          email: user.email,
        })
        .returning(['id', 'handle'])
        .executeTakeFirstOrThrow()

      return { ...user, id }
    },
    async getUser(id) {
      const result = await db
        .selectFrom('User')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      if (!result) return null
      return result
    },
    async getUserByEmail(email) {
      const result = await db
        .selectFrom('User')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst()
      if (!result) return null
      return result
    },
    async getUserByAccount({ providerAccountId, provider }) {
      const result = await db
        .selectFrom('User')
        .innerJoin('Account', 'User.id', 'Account.userId')
        .selectAll('User')
        .where('Account.providerAccountId', '=', providerAccountId)
        .where('Account.provider', '=', provider)
        .executeTakeFirst()
      if (!result) return null

      return result
    },
    async linkAccount(account) {
      await db.insertInto('Account').values(account).executeTakeFirstOrThrow()
      return account
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await db
        .deleteFrom('Account')
        .where('Account.providerAccountId', '=', providerAccountId)
        .where('Account.provider', '=', provider)
        .executeTakeFirstOrThrow()
    },
  }
}
