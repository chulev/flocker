import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('Hashtag')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('value', 'text', (c) => c.notNull().unique())
    .execute()

  await db.schema
    .createTable('TweetHashtag')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('tweetId', 'uuid', (c) =>
      c.references('Tweet.id').onDelete('cascade').notNull()
    )
    .addColumn('hashtagId', 'uuid', (c) =>
      c.references('Hashtag.id').onDelete('cascade').notNull()
    )
    .addUniqueConstraint('tweet_hashtag_tweetId_hashtagId_unique', [
      'tweetId',
      'hashtagId',
    ])
    .execute()

  await db.schema
    .createIndex('tweetHashtag_tweetId_idx')
    .on('TweetHashtag')
    .column('tweetId')
    .execute()

  await db.schema
    .createIndex('tweetHashtag_hashtagId_idx')
    .on('TweetHashtag')
    .column('hashtagId')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('TweetHashtag').ifExists().execute()
  await db.schema.dropTable('Hashtag').ifExists().execute()
}
