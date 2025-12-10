import Footer from '@/components/layout/Footer'
import HeaderSection from '@/components/layout/header/HeaderSection'
import FloatingCart from '@/features/cart/components/FloatingCart'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderSection />
      {children}
      <Footer />

      {/* 장바구니 */}
      <FloatingCart />
    </>
  )
}
