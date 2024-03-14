import { Logo } from '../_components/logo'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className='grid bg-auth'>
      <section className='mx-auto flex w-[400px] flex-col justify-center border border-mist bg-pure p-8 max-sm:w-full'>
        <Logo />
        <div className='mt-6'>{children}</div>
      </section>
    </section>
  )
}
