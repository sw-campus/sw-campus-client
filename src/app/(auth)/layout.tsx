import HeaderSection from '@/components/layout/header/header-section'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderSection />
      {children}
    </>
  )
}
