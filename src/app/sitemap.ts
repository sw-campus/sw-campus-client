import type { MetadataRoute } from 'next'

import { env } from '@/lib/env'

interface LectureListItem {
  id: number
  updatedAt?: string
}

interface OrganizationListItem {
  id: number
}

interface PostListItem {
  id: number
  createdAt?: string
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: env.NEXT_PUBLIC_BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${env.NEXT_PUBLIC_BASE_URL}/lectures/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${env.NEXT_PUBLIC_BASE_URL}/organizations`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${env.NEXT_PUBLIC_BASE_URL}/community`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // 동적 페이지들을 병렬로 fetch (성능 최적화)
  const [lecturesResult, orgsResult, postsResult] = await Promise.allSettled([
    fetch(`${env.NEXT_PUBLIC_API_URL}/lectures?size=1000`, { next: { revalidate: 3600 } }),
    fetch(`${env.NEXT_PUBLIC_API_URL}/organizations?size=1000`, { next: { revalidate: 3600 } }),
    fetch(`${env.NEXT_PUBLIC_API_URL}/posts?size=1000`, { next: { revalidate: 3600 } }),
  ])

  // 강의 페이지
  let lectureRoutes: MetadataRoute.Sitemap = []
  if (lecturesResult.status === 'fulfilled' && lecturesResult.value.ok) {
    try {
      const lecturesData = await lecturesResult.value.json()
      const lectures: LectureListItem[] = lecturesData.content || []
      lectureRoutes = lectures.map(lecture => ({
        url: `${env.NEXT_PUBLIC_BASE_URL}/lectures/${lecture.id}`,
        lastModified: lecture.updatedAt ? new Date(lecture.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    } catch {
      // JSON 파싱 에러 시 빈 배열 유지
    }
  }

  // 기관 페이지
  let organizationRoutes: MetadataRoute.Sitemap = []
  if (orgsResult.status === 'fulfilled' && orgsResult.value.ok) {
    try {
      const orgsData = await orgsResult.value.json()
      const organizations: OrganizationListItem[] = orgsData.content || orgsData || []
      organizationRoutes = organizations.map(org => ({
        url: `${env.NEXT_PUBLIC_BASE_URL}/organizations/${org.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    } catch {
      // JSON 파싱 에러 시 빈 배열 유지
    }
  }

  // 커뮤니티 게시글 페이지
  let postRoutes: MetadataRoute.Sitemap = []
  if (postsResult.status === 'fulfilled' && postsResult.value.ok) {
    try {
      const postsData = await postsResult.value.json()
      const posts: PostListItem[] = postsData.content || []
      postRoutes = posts.map(post => ({
        url: `${env.NEXT_PUBLIC_BASE_URL}/community/${post.id}`,
        lastModified: post.createdAt ? new Date(post.createdAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }))
    } catch {
      // JSON 파싱 에러 시 빈 배열 유지
    }
  }

  return [...staticRoutes, ...lectureRoutes, ...organizationRoutes, ...postRoutes]
}
