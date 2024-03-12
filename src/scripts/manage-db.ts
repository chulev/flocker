import { promises as fs } from 'fs'
import {
  FileMigrationProvider,
  type MigrationResultSet,
  Migrator,
  NO_MIGRATIONS,
} from 'kysely'
import * as path from 'path'

import { db } from '../lib/db/client'

const COMMANDS = ['up', 'down', 'latest', 'reset', 'new'] as const
type Command = (typeof COMMANDS)[number]

const TEMPLATE = `import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
}

export async function down(db: Kysely<any>): Promise<void> {
}
`

const isCommand = (value: any): value is Command => {
  return COMMANDS.includes(value?.trim())
}

async function manageDb() {
  const [, , folderPath, command, name] = process.argv

  if (!folderPath) {
    console.error('No folder specified.')
    return
  }

  if (!isCommand(command)) {
    console.error(`Invalid command: must be one of ${COMMANDS.join(', ')}.`)
    return
  }

  if (command === 'new') {
    if (!name) {
      console.error('Please supply a name.')
    } else {
      const date = new Date().toISOString().replace(/[-:]/g, '').split('.')[0]
      const fileName = `${date}-${name}.ts`

      try {
        await fs.writeFile(
          path.join(__dirname, `../${folderPath}/${fileName}`),
          TEMPLATE
        )

        console.log(`${fileName} created in ${folderPath}.`)
      } catch (err) {
        console.error(err)
      }
    }

    return
  }

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, `../${folderPath}`),
    }),
  })

  const execute = async (
    command: Exclude<Command, 'new'>
  ): Promise<MigrationResultSet> => {
    switch (command) {
      case 'up':
        return await migrator.migrateUp()
      case 'down':
        return await migrator.migrateDown()
      case 'reset':
        return await migrator.migrateTo(NO_MIGRATIONS)
      case 'latest':
        return await migrator.migrateToLatest()
    }
  }

  const { error, results } = await execute(command)

  if (results?.length === 0) {
    console.log('No changes to the database were made.')
  }

  results?.forEach((result) => {
    if (result.status === 'Success') {
      console.log(`"${result.migrationName}" was executed successfully.`)
    } else if (result.status === 'Error') {
      console.error(`Failed to execute "${result.migrationName}".`)
    }
  })

  if (error) {
    console.error('Failed to execute script.')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

manageDb()
