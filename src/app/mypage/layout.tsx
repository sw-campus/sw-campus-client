import Footer from '@/components/layout/footer'
import HeaderSection from '@/components/layout/header/header-section'

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderSection />
      {children}
      <Footer />
    </>
  )
}
