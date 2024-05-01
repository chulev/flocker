import { cx } from 'class-variance-authority'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import '@/app/globals.css'
import { fetchUser } from '@/lib/auth'

export async function generateViewport() {
  const currentUser = await fetchUser()
  const usesLightTheme = currentUser?.theme === 'light'

  return {
    themeColor: usesLightTheme ? '#f2f2f2' : '#22303c',
  }
}

const font = Inter({
  weight: ['400', '500', '600'],
  subsets: ['latin', 'cyrillic'],
  variable: '--inter',
})

export const metadata: Metadata = {
  title: 'Flocker',
  description: 'Be social',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await fetchUser()

  return (
    <html lang='en' data-theme={currentUser?.theme || 'light'}>
      <body
        className={cx('grid min-h-screen bg-foggy font-sans', font.variable)}
      >
        {children}
      </body>
    </html>
  )
}
