'use server'

import { hash } from '@/lib/auth/password'
import { generateVerificationToken } from '@/lib/auth/token'
import { db } from '@/lib/db/client'
import { sendVerificationEmail } from '@/lib/mail'
import { formDataToValues } from '@/lib/serialize'
import { REGISTER_SCHEMA } from '@/lib/validations'

export const signUp = async (data: FormData) => {
  const deserializedValues = formDataToValues(data)
  const { name, email, password, handle } =
    REGISTER_SCHEMA.parse(deserializedValues)
  const existingUser = await db
    .selectFrom('User')
    .select(['email', 'handle', 'emailVerified'])
    .where((eb) => eb.or([eb('email', '=', email), eb('handle', '=', handle)]))
    .executeTakeFirst()

  const hashedPassword = hash(password)

  if (existingUser && !existingUser.emailVerified) {
    await db
      .updateTable('User')
      .set({
        name,
        email,
        handle,
        password: hashedPassword,
      })
      .executeTakeFirstOrThrow()

    const verificationToken = await generateVerificationToken(email)
    return await sendVerificationEmail(
      verificationToken.email,
      verificationToken.id
    )
  }

  await db
    .insertInto('User')
    .values({
      name,
      email,
      handle,
      password: hashedPassword,
    })
    .executeTakeFirstOrThrow()

  const verificationToken = await generateVerificationToken(email)
  await sendVerificationEmail(verificationToken.email, verificationToken.id)
}
