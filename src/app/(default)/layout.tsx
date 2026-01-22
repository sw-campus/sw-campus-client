import { ScrollToTopButton } from '@/components/common/scroll-to-top-button'
import Footer from '@/components/layout/footer'
import HeaderSection from '@/components/layout/header/header-section'
import FloatingCart from '@/features/cart/components/floating-cart'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HeaderSection />
      {children}
      <Footer />
      <FloatingCart />
      <ScrollToTopButton />
    </>
  )
}
