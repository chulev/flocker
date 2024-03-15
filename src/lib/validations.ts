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
