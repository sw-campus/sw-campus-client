import Footer from '@/components/layout/footer'
import HeaderSection from '@/components/layout/header/header-section'
import { MypageHeaderSection } from '@/features/mypage/components/mypage-header-section'

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 모바일: 마이페이지 전용 헤더 (햄버거 + 로고만) */}
      <div className="md:hidden">
        <MypageHeaderSection />
      </div>
      {/* 데스크톱: 기본 헤더 */}
      <div className="hidden md:block">
        <HeaderSection />
      </div>
      {children}
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  )
}
