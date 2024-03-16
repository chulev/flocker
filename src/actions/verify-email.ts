'use server'

import { fetchVerificationToken } from '@/data/token'
import { getUserByEmail } from '@/data/user'
import { db } from '@/lib/db/client'

export const verifyEmail = async (token: string) => {
  const existingToken = await fetchVerificationToken(token)

  if (!existingToken || new Date(existingToken.expires) < new Date()) {
    throw Error('Token expired')
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) throw Error('User not found')

  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable('User')
      .set({
        emailVerified: new Date(),
        email: existingToken.email,
      })
      .where('id', '=', existingUser.id)
      .executeTakeFirstOrThrow()

    await trx
      .deleteFrom('VerificationToken')
      .where('id', '=', existingToken.id)
      .executeTakeFirstOrThrow()
  })
}
