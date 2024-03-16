'use server'

import { fetchResetPasswordToken } from '@/data/token'
import { getUserByEmail } from '@/data/user'
import { hash } from '@/lib/auth/password'
import { db } from '@/lib/db/client'
import { formDataToValues } from '@/lib/serialize'
import { RESET_PASSWORD_SCHEMA } from '@/lib/validations'

export const resetPassword = async (data: FormData) => {
  const deserializedValues = formDataToValues(data)
  const { password, token } = RESET_PASSWORD_SCHEMA.parse(deserializedValues)
  const existingToken = await fetchResetPasswordToken(token)

  if (!existingToken || new Date(existingToken.expires) < new Date()) {
    throw Error('Token expired')
  }

  const existingUser = await getUserByEmail(existingToken.email)

  if (!existingUser) throw Error('User not found')

  const hashedPassword = hash(password)

  await db.transaction().execute(async (trx) => {
    await trx
      .updateTable('User')
      .set({
        password: hashedPassword,
      })
      .where('id', '=', existingUser.id)
      .executeTakeFirstOrThrow()

    await trx
      .deleteFrom('ResetPasswordToken')
      .where('id', '=', existingToken.id)
      .executeTakeFirstOrThrow()
  })
}
