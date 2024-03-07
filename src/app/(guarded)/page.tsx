import { Metadata } from 'next/types'

export const metadata: Metadata = {
  title: 'Home | Flocker',
  description: 'Be social',
}

export default async function HomePage() {
  return <div>Home page</div>
}
