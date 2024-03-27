import { NextRequest } from 'next/server'

import { doesCurrentUserFollow } from '@/data/user'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const currentUser = await getCurrentUser()

  if (!currentUser) return Response.json('Not authorized', { status: 401 })

  const isFollowing = await doesCurrentUserFollow(currentUser.handle, id)

  return Response.json({ isFollowing })
}
