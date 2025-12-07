import type { Metadata, Viewport } from 'next'

import QueryClientProviderWrapper from '@/components/providers/query-client-provider'

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
      <body>
        <QueryClientProviderWrapper>{children}</QueryClientProviderWrapper>
      </body>
    </html>
  )
}
