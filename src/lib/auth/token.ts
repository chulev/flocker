import { db } from '@/lib/db/client'

const THREE_HOURS = 3600 * 3000

export const generateVerificationToken = async (email: string) => {
  const existingToken = await db
    .selectFrom('VerificationToken')
    .select(['id'])
    .where('email', '=', email)
    .executeTakeFirst()

  if (existingToken) {
    await db
      .deleteFrom('VerificationToken')
      .where('id', '=', existingToken.id)
      .executeTakeFirstOrThrow()
  }

  return await db
    .insertInto('VerificationToken')
    .values({
      email,
      expires: new Date(new Date().getTime() + THREE_HOURS),
    })
    .returning(['id', 'email'])
    .executeTakeFirstOrThrow()
}
