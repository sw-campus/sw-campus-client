import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 🔒 보안 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },
  output: 'standalone', // Docker 이미지 최적화를 위한 standalone 모드
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 TypeScript 에러 무시
  },
  experimental: {
    // Barrel import 최적화 - 직접 import로 자동 변환하여 번들 사이즈 감소
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-alert-dialog',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      'date-fns',
      'lodash',
    ],
  },
  images: {
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sayun.studio',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sw-campus-public-prod-afe42bff.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sw-campus-public-prod-6d717af7.s3.ap-northeast-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // 환경변수가 설정된 경우에만 추가
      ...(process.env.NEXT_PRIVATE_S3_HOSTNAME
        ? [{ protocol: 'https' as const, hostname: process.env.NEXT_PRIVATE_S3_HOSTNAME, port: '', pathname: '/**' }]
        : []),
      ...(process.env.NEXT_PUBLIC_S3_HOSTNAME
        ? [{ protocol: 'https' as const, hostname: process.env.NEXT_PUBLIC_S3_HOSTNAME, port: '', pathname: '/**' }]
        : []),
      ...(process.env.NEXT_S3_ONEDAY_HOSTNAME
        ? [{ protocol: 'https' as const, hostname: process.env.NEXT_S3_ONEDAY_HOSTNAME, port: '', pathname: '/**' }]
        : []),
      ...(process.env.NEXT_PUBLIC_S3_CAMPUS_HOSTNAME
        ? [
            {
              protocol: 'https' as const,
              hostname: process.env.NEXT_PUBLIC_S3_CAMPUS_HOSTNAME,
              port: '',
              pathname: '/**',
            },
          ]
        : []),
    ],
  },
}

export default nextConfig
