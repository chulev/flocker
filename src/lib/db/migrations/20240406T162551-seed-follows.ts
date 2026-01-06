import type { Kysely } from 'kysely'

import { getRandomNumberInRange } from '../utils'

export async function up(db: Kysely<any>): Promise<void> {
  const users = await db.selectFrom('User').select('id').execute()
  const userIds = users.map((user) => user.id)

  await db
    .insertInto('Follow')
    .values(
      userIds.flatMap((userId, userIdx) => {
        const filteredUserIds = userIds.filter((uId) => userId !== uId)

        return [...Array(getRandomNumberInRange(1, 3))].map(
          (_, interactionIdx) => ({
            followerId: userId,
            followeeId:
              filteredUserIds[
                (userIdx + interactionIdx) % filteredUserIds.length
              ],
          })
        )
      })
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.deleteFrom('Follow').execute()
}
