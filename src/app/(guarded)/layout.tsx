import NextTopLoader from 'nextjs-toploader'

import { Footer } from './_components/footer'
import { Header } from './_components/header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NextTopLoader color='#2f80ed' height={2} showSpinner={false} />
      <section className='bg-foggy grid grid-rows-[auto_2fr_auto]'>
        <Header />
        {children}
        <Footer />
      </section>
    </>
  )
}
