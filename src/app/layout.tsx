import type { Metadata, Viewport } from 'next'

import Script from 'next/script'

import KakaoChannelButton from '@/components/common/kakao-channel-button'
import QueryClientProviderWrapper from '@/components/providers/query-client-provider'
import { JsonLd, createWebsiteJsonLd } from '@/components/seo/json-ld'
import { Toaster } from '@/components/ui/sonner'

import './globals.css'

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://softwarecampus.co.kr'

// 검색엔진 인증 코드 (환경변수로 관리)
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
const NAVER_VERIFICATION = process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: '소프트웨어캠퍼스',
    template: '%s | 소프트웨어캠퍼스',
  },
  description: '국비지원 IT 부트캠프 비교 플랫폼 - 강의 비교, 수강 후기, 취업 정보를 한눈에',
  keywords: ['부트캠프', '국비지원', 'IT교육', '개발자', '코딩', '프로그래밍', '취업'],
  authors: [{ name: '소프트웨어캠퍼스' }],
  creator: '소프트웨어캠퍼스',
  icons: {
    icon: '/icons/icon.png',
    shortcut: '/icons/favicon.ico',
    apple: '/icons/apple-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: '소프트웨어캠퍼스',
    locale: 'ko_KR',
    url: BASE_URL,
    title: '소프트웨어캠퍼스',
    description: '국비지원 IT 부트캠프 비교 플랫폼 - 강의 비교, 수강 후기, 취업 정보를 한눈에',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: GOOGLE_VERIFICATION,
    other: NAVER_VERIFICATION ? { 'naver-site-verification': NAVER_VERIFICATION } : undefined,
  },
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
      {/* Google Analytics */}
      {GA_TRACKING_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="afterInteractive" />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
              cookie_domain: window.location.hostname === 'localhost' ? 'none' : 'auto',
              });
            `}
          </Script>
        </>
      )}
      <body className="relative flex min-h-screen flex-col">
        <JsonLd data={createWebsiteJsonLd(BASE_URL)} />
        <QueryClientProviderWrapper>
          {children}
          <Toaster richColors closeButton position="bottom-center" />
          <KakaoChannelButton />
        </QueryClientProviderWrapper>
      </body>
    </html>
  )
}
