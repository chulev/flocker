'use server'

import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import type { Theme } from '@/lib/types'
import { THEME_SCHEMA } from '@/lib/validations'

export const changeTheme = async (theme: Theme) => {
  const currentUser = await getCurrentUserOrThrow()
  const parsedTheme = THEME_SCHEMA.parse(theme)

  await db
    .updateTable('User')
    .set({
      theme: parsedTheme,
    })
    .where('id', '=', currentUser.id)
    .executeTakeFirstOrThrow()
}
