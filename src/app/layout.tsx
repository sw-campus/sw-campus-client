import type { Metadata, Viewport } from 'next'

import QueryClientProviderWrapper from '@/components/providers/query-client-provider'
import { Toaster } from '@/components/ui/sonner'

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
      <body className="relative flex min-h-screen flex-col">
        <div className="pointer-events-none fixed inset-0 -z-20 bg-[url('/images/bg.png')] bg-cover bg-top bg-no-repeat" />
        <div className="pointer-events-none fixed inset-0 -z-10 bg-black/40" />
        <QueryClientProviderWrapper>
          {children}
          <Toaster richColors closeButton position="bottom-center" />
        </QueryClientProviderWrapper>
      </body>
    </html>
  )
}
