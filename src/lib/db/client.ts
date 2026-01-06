import { Kysely, PostgresDialect } from 'kysely'
import { NeonDialect } from 'kysely-neon'
import { Pool } from 'pg'

import type { DB } from './schema'

const dialect =
  process.env.NODE_ENV === 'production'
    ? new NeonDialect({ connectionString: process.env.DATABASE_URL })
    : new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
          max: 10,
        }),
      })

export const db = new Kysely<DB>({
  dialect,
})
