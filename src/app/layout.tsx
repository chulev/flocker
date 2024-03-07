import { cx } from 'class-variance-authority'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import '@/app/globals.css'

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
  return (
    <html lang='en'>
      <body className={cx('grid min-h-screen font-sans', font.variable)}>
        {children}
      </body>
    </html>
  )
}
