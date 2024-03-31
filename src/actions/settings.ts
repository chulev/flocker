'use server'

import { revalidatePath } from 'next/cache'

import { getCurrentUserOrThrow } from '@/lib/auth'
import { db } from '@/lib/db/client'
import { formDataToValues } from '@/lib/serialize'
import { SETTINGS_SCHEMA } from '@/lib/validations'

import { upload } from './upload'

export const update = async (data: FormData) => {
  const deserializedValues = formDataToValues(data)
  const parsedValues = SETTINGS_SCHEMA.parse(deserializedValues)
  const user = await getCurrentUserOrThrow()
  const avatarPath =
    parsedValues.avatar instanceof File
      ? await upload(parsedValues.avatar)
      : parsedValues.avatar
  const coverPath =
    parsedValues.cover instanceof File
      ? await upload(parsedValues.cover)
      : parsedValues.cover

  const updatedUser = await db
    .updateTable('User')
    .set({
      name: parsedValues.name,
      handle: parsedValues.handle,
      description: parsedValues.bio,
      ...(avatarPath && { image: avatarPath }),
      ...(coverPath && { cover: coverPath }),
    })
    .where('id', '=', user.id)
    .returning(['name', 'handle', 'description', 'image', 'cover'])
    .executeTakeFirstOrThrow()

  revalidatePath('/settings')
}
