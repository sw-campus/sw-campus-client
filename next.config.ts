import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: 'standalone', // Docker 이미지 최적화를 위한 standalone 모드
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 에러 무시
  },
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
        hostname: 'boottent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sayun.studio',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
