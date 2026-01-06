import { type Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.createType('theme').asEnum(['light', 'dark']).execute()
  await db.schema
    .createTable('User')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('name', 'text', (c) => c.notNull())
    .addColumn('email', 'text', (c) => c.unique().notNull())
    .addColumn('handle', 'text', (c) =>
      c.unique().notNull().defaultTo(sql`substr(md5(random()::text), 1, 8)`)
    )
    .addColumn('password', 'text')
    .addColumn('emailVerified', 'timestamptz')
    .addColumn('image', 'text')
    .addColumn('cover', 'text')
    .addColumn('description', 'text')
    .addColumn('theme', sql`theme`, (c) => c.notNull().defaultTo('light'))
    .addUniqueConstraint('email_handle_unique', ['email', 'handle'])
    .execute()

  await db.schema
    .createIndex('user_email_idx')
    .on('User')
    .column('email')
    .execute()

  await db.schema
    .createIndex('user_handle_idx')
    .on('User')
    .column('handle')
    .execute()

  await db.schema
    .createIndex('user_emailVerified_idx')
    .on('User')
    .column('emailVerified')
    .execute()

  await db.schema
    .createTable('Account')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('userId', 'uuid', (c) =>
      c.references('User.id').onDelete('cascade').notNull()
    )
    .addColumn('type', 'text', (c) => c.notNull())
    .addColumn('provider', 'text', (c) => c.notNull())
    .addColumn('providerAccountId', 'text', (c) => c.notNull())
    .addColumn('refresh_token', 'text')
    .addColumn('access_token', 'text')
    .addColumn('expires_at', 'bigint')
    .addColumn('token_type', 'text')
    .addColumn('scope', 'text')
    .addColumn('id_token', 'text')
    .addColumn('session_state', 'text')
    .execute()

  await db.schema
    .createIndex('account_userId_idx')
    .on('Account')
    .column('userId')
    .execute()

  await db.schema
    .createTable('VerificationToken')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('email', 'text', (c) => c.unique().notNull())
    .addColumn('expires', 'timestamptz', (c) => c.notNull())
    .execute()

  await db.schema
    .createIndex('verificationToken_email_idx')
    .on('VerificationToken')
    .column('email')
    .execute()

  await db.schema
    .createTable('ResetPasswordToken')
    .addColumn('id', 'uuid', (c) =>
      c.primaryKey().defaultTo(sql`uuid_generate_v7()`)
    )
    .addColumn('email', 'text', (c) => c.unique().notNull())
    .addColumn('expires', 'timestamptz', (c) => c.notNull())
    .execute()

  await db.schema
    .createIndex('resetPasswordToken_email_idx')
    .on('ResetPasswordToken')
    .column('email')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('ResetPasswordToken').ifExists().execute()
  await db.schema.dropTable('VerificationToken').ifExists().execute()
  await db.schema.dropTable('Account').ifExists().execute()
  await db.schema.dropTable('User').ifExists().execute()
  await db.schema.dropType('theme').ifExists().execute()
}
