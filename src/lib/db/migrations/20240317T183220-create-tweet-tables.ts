import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('Tweet')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('userId', 'uuid', (c) =>
      c.references('User.id').onDelete('cascade').notNull()
    )
    .addColumn('retweetId', 'uuid', (c) =>
      c.references('Tweet.id').onDelete('cascade')
    )
    .addColumn('content', 'text', (c) => c.notNull())
    .addColumn('followerOnly', 'boolean', (c) => c.defaultTo(false).notNull())
    .execute()

  await db.schema
    .createIndex('tweet_userId_idx')
    .on('Tweet')
    .column('userId')
    .execute()
  await db.schema
    .createIndex('tweet_retweetId_id_idx')
    .on('Tweet')
    .columns(['retweetId', 'id'])
    .execute()

  await db.schema
    .createTable('TweetAttachment')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('tweetId', 'uuid', (c) =>
      c.references('Tweet.id').onDelete('cascade').notNull()
    )
    .addColumn('uri', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createIndex('tweetAttachment_tweetId_idx')
    .on('TweetAttachment')
    .column('tweetId')
    .execute()

  await db.schema
    .createTable('TweetLike')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('userId', 'uuid', (c) =>
      c.references('User.id').onDelete('cascade').notNull()
    )
    .addColumn('tweetId', 'uuid', (c) =>
      c.references('Tweet.id').onDelete('cascade').notNull()
    )
    .addUniqueConstraint('tweetLike_userId_tweetId_unique', [
      'userId',
      'tweetId',
    ])
    .execute()

  await db.schema
    .createIndex('tweetLike_tweetId_idx')
    .on('TweetLike')
    .column('tweetId')
    .execute()
  await db.schema
    .createIndex('tweetLike_userId_idx')
    .on('TweetLike')
    .column('userId')
    .execute()

  await db.schema
    .createTable('Bookmark')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('userId', 'uuid', (c) =>
      c.references('User.id').onDelete('cascade').notNull()
    )
    .addColumn('tweetId', 'uuid', (c) =>
      c.references('Tweet.id').onDelete('cascade').notNull()
    )
    .addUniqueConstraint('bookmark_userId_tweetId_unique', [
      'userId',
      'tweetId',
    ])
    .execute()

  await db.schema
    .createIndex('bookmark_tweetId_idx')
    .on('Bookmark')
    .column('tweetId')
    .execute()
  await db.schema
    .createIndex('bookmark_userId_idx')
    .on('Bookmark')
    .column('userId')
    .execute()

  await db.schema
    .createTable('Reply')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('userId', 'uuid', (c) =>
      c.references('User.id').onDelete('cascade').notNull()
    )
    .addColumn('tweetId', 'uuid', (c) =>
      c.references('Tweet.id').onDelete('cascade').notNull()
    )
    .addColumn('content', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createIndex('reply_tweetId_idx')
    .on('Reply')
    .column('tweetId')
    .execute()
  await db.schema
    .createIndex('reply_userId_idx')
    .on('Reply')
    .column('userId')
    .execute()

  await db.schema
    .createTable('ReplyAttachment')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('replyId', 'uuid', (c) =>
      c.references('Reply.id').onDelete('cascade').notNull()
    )
    .addColumn('uri', 'text', (c) => c.notNull())
    .execute()

  await db.schema
    .createIndex('replyAttachment_replyId_idx')
    .on('ReplyAttachment')
    .column('replyId')
    .execute()

  await db.schema
    .createTable('ReplyLike')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('userId', 'uuid', (c) =>
      c.references('User.id').onDelete('cascade').notNull()
    )
    .addColumn('replyId', 'uuid', (c) =>
      c.references('Reply.id').onDelete('cascade').notNull()
    )
    .addUniqueConstraint('replyLike_userId_replyId_unique', [
      'userId',
      'replyId',
    ])
    .execute()

  await db.schema
    .createIndex('replyLike_replyId_idx')
    .on('ReplyLike')
    .column('replyId')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('ReplyLike').ifExists().execute()
  await db.schema.dropTable('ReplyAttachment').ifExists().execute()
  await db.schema.dropTable('Reply').ifExists().execute()
  await db.schema.dropTable('Bookmark').ifExists().execute()
  await db.schema.dropTable('TweetLike').ifExists().execute()
  await db.schema.dropTable('TweetAttachment').ifExists().execute()
  await db.schema.dropTable('Tweet').ifExists().execute()
}
