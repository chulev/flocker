import { z } from 'zod'

export const MAIN_CHANNEL_KEY = 'all'

export const THEME_SCHEMA = z.enum(['light', 'dark'])

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
  'image/gif',
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
  }, 'Only .jpg, .jpeg, .png, .gif and .webp formats are supported')

export const MAX_BIO_LENGTH = 250
export const SETTINGS_SCHEMA = z.object({
  name: NAME_SCHEMA,
  handle: HANDLE_SCHEMA,
  bio: z
    .string()
    .trim()
    .max(MAX_BIO_LENGTH, {
      message: `Bio cannot exceed ${MAX_BIO_LENGTH} symbols`,
    }),
  avatar: IMG_PICKER_SCHEMA,
  cover: IMG_PICKER_SCHEMA,
})

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

export const REPLY_SCHEMA = z.object({
  content: z
    .string()
    .trim()
    .min(1, { message: 'Reply cannot be empty' })
    .max(MAX_CONTENT_LENGTH, {
      message: `Reply cannot exceed ${MAX_CONTENT_LENGTH} symbols`,
    }),
  img: IMG_PICKER_SCHEMA,
  followerOnly: z.enum(['Y', 'N']),
})

export const DEFAULT_LIMIT = 10
export const REPLY_LIMIT = 5
export const HASHTAG_LIMIT = 5
export const WHO_TO_FOLLOW_LIMIT = 5
export const NEXT_CURSOR_SCHEMA = z.string().nullable()
export const LIMIT_SCHEMA = z
  .string()
  .nullable()
  .transform((limit) => {
    if (!limit) return DEFAULT_LIMIT

    const parsedLimit = parseInt(limit, 10)
    if (Number.isNaN(parsedLimit) || parsedLimit > 10) return DEFAULT_LIMIT

    return parsedLimit
  })
export const ORDER_SCHEMA = z
  .enum(['asc', 'desc'])
  .nullable()
  .transform((limit) => {
    if (!limit) return 'desc'

    return limit
  })

export const USER_TWEETS_FILTERS_SCHEMA = z
  .enum(['tweets', 'replies', 'media', 'likes'])
  .default('tweets')
export const TWEETS_FILTERS_SCHEMA = z
  .enum(['home', 'latest', 'top', 'media', 'bookmarks'])
  .default('home')
