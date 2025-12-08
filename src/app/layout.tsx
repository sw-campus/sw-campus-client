import type { Metadata, Viewport } from 'next'

import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'
import QueryClientProviderWrapper from '@/components/providers/query-client-provider'
import { Toaster } from '@/components/ui/sonner'
import { BannerSection } from '@/features/banner/components/BannerSection'
import FloatingCart from '@/features/cart/components/FloatingCart'

import './globals.css'

export const metadata: Metadata = {
  title: '소프트웨어캠퍼스',
  description: '소프트웨어캠퍼스',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // maximumScale: 1, // 최대 확대 배율 제한
  // userScalable: false, // 확대/축소 불가 설정
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="relative flex min-h-screen flex-col bg-[url('/images/bg.jpg')] bg-cover bg-center bg-no-repeat">
        {/* 화면 약간 어둡게 오버레이 */}
        <div className="pointer-events-none absolute inset-0 bg-black/40" />
        <QueryClientProviderWrapper>
          <Header />
          <BannerSection />
          <main className="relative flex flex-1 flex-col py-8">
            <div className="mx-auto w-full max-w-7xl rounded-3xl border border-white/10 bg-white/40 p-8 px-4 shadow-xl backdrop-blur-xl">
              {children}
            </div>
          </main>
          <Footer />
          <FloatingCart />
          <Toaster richColors closeButton />
        </QueryClientProviderWrapper>
      </body>
    </html>
  )
}
