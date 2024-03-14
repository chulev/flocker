import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

const SCRYPT_PARAMS = {
  N: 131072,
  r: 8,
  p: 1,
  maxmem: 136314880,
}

export const hash = (password: string) => {
  const salt = randomBytes(64).toString('hex')
  const hashedPassword = scryptSync(password, salt, 64, SCRYPT_PARAMS)

  return `${salt}.${hashedPassword.toString('hex')}`
}

export const verify = (hash: string, password: string) => {
  const [salt, hashKey] = hash.split('.')
  const hashKeyBuff = Buffer.from(hashKey, 'hex')
  const hashedPassword = scryptSync(password, salt, 64, SCRYPT_PARAMS)

  return timingSafeEqual(hashKeyBuff, hashedPassword)
}
