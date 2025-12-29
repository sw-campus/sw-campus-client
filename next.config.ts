import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone', // Docker 이미지 최적화를 위한 standalone 모드
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 TypeScript 에러 무시
  },
  images: {
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
