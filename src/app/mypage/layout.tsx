import Footer from '@/components/layout/Footer'
import HeaderSection from '@/components/layout/header/HeaderSection'

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderSection />
      {children}
      <Footer />
    </>
  )
}
