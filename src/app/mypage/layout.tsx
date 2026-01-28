import Footer from '@/components/layout/footer'
import HeaderSection from '@/components/layout/header/header-section'

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 모바일에서는 헤더/푸터 숨김 */}
      <div className="hidden sm:block">
        <HeaderSection />
      </div>
      {children}
      <div className="hidden sm:block">
        <Footer />
      </div>
    </>
  )
}
