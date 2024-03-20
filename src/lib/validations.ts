import { z } from 'zod'

export const MAX_NAME_LENGTH = 70
export const MAX_HANDLE_LENGTH = 30
const NAME_SCHEMA = z
  .string()
  .trim()
  .min(1, { message: 'Name is required' })
  .max(70, { message: `Name cannot exceed ${MAX_NAME_LENGTH} symbols` })
const HANDLE_SCHEMA = z
  .string()
  .regex(/^[A-Za-z][A-Za-z0-9]*$/, {
    message: 'Only English letters and numbers are allowed',
  })
  .min(3, { message: 'Handle must be at least 3 characters' })
  .max(30, { message: `Handle cannot exceed ${MAX_HANDLE_LENGTH} symbols` })
export const LOGIN_SCHEMA = z.object({
  email: z.string().email({
    message: 'Email not valid',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})

export const UUID_SCHEMA = z.string().uuid()

export const REGISTER_SCHEMA = z
  .object({
    name: NAME_SCHEMA,
    email: z.string().email({
      message: 'Email not valid',
    }),
    handle: HANDLE_SCHEMA,
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    ({ password, confirmPassword }) =>
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password === confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  )

export const FORGOT_PASSWORD_SCHEMA = z.object({
  email: z.string().email({
    message: 'Email not valid',
  }),
})

export const RESET_PASSWORD_SCHEMA = z
  .object({
    token: UUID_SCHEMA,
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    ({ password, confirmPassword }) =>
      password.length > 0 &&
      confirmPassword.length > 0 &&
      password === confirmPassword,
    {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }
  )

export const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]
const MAX_FILE_SIZE = 1024 * 1024 * 10
const IMG_PICKER_SCHEMA = z
  .instanceof(File)
  .or(z.string())
  .refine((file) => {
    if (!(file instanceof File)) return true

    return file.size <= MAX_FILE_SIZE
  }, 'Max image size is 10 MB')
  .refine((file) => {
    if (!(file instanceof File)) return true

    return ACCEPTED_IMAGE_MIME_TYPES.includes(file.type)
  }, 'Only .jpg, .jpeg, .png and .webp formats are supported')

export const MAX_CONTENT_LENGTH = 180
export const TWEET_SCHEMA = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: 'Tweet cannot be empty' })
    .max(MAX_CONTENT_LENGTH, {
      message: `Tweet cannot exceed ${MAX_CONTENT_LENGTH} symbols`,
    }),
  img: IMG_PICKER_SCHEMA,
  followerOnly: z.enum(['Y', 'N']),
})
