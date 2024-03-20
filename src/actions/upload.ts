'use server'

import { sha256 } from 'js-sha256'

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string
const SECRET = process.env.CLOUDINARY_SECRET as string
const API_KEY = process.env.CLOUDINARY_API_KEY as string
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

const sign = (file: File) => {
  const timestamp = String(+new Date())
  const signature = sha256(`timestamp=${timestamp}${SECRET}`)

  const data = new FormData()
  data.append('file', file)
  data.append('api_key', API_KEY)
  data.append('timestamp', timestamp)
  data.append('signature', signature)

  return data
}

export const upload = async (file: File) => {
  if (!API_KEY || !SECRET || !CLOUD_NAME) return Promise.resolve(null)

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: sign(file),
  })
    .then((response) => response.json())
    .catch((err) => {
      throw err
    })

  return `${response.version}/${response.public_id}.${response.format}`
}
