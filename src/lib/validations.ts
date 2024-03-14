import { z } from 'zod'

export const LOGIN_SCHEMA = z.object({
  email: z.string().email({
    message: 'Email not valid',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
})
