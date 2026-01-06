import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('Follow')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('followerId', 'uuid', (c) =>
      c.references('User.id').onDelete('cascade').notNull()
    )
    .addColumn('followeeId', 'uuid', (c) =>
      c.references('User.id').onDelete('cascade').notNull()
    )
    .addUniqueConstraint('follow_followerId_followeeId_unique', [
      'followerId',
      'followeeId',
    ])
    .execute()

  await db.schema
    .createIndex('follow_followerId_idx')
    .on('Follow')
    .column('followerId')
    .execute()

  await db.schema
    .createIndex('follow_followeeId_idx')
    .on('Follow')
    .column('followeeId')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('Follow').ifExists().execute()
}
