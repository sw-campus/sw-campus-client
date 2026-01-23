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

  // 동적 강의 페이지
  let lectureRoutes: MetadataRoute.Sitemap = []
  try {
    const lecturesRes = await fetch(`${env.NEXT_PUBLIC_API_URL}/lectures?size=1000`, {
      next: { revalidate: 3600 },
    })
    if (lecturesRes.ok) {
      const lecturesData = await lecturesRes.json()
      const lectures: LectureListItem[] = lecturesData.content || []
      lectureRoutes = lectures.map(lecture => ({
        url: `${env.NEXT_PUBLIC_BASE_URL}/lectures/${lecture.id}`,
        lastModified: lecture.updatedAt ? new Date(lecture.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
    }
  } catch {
    // API 에러 시 빈 배열 유지
  }

  // 동적 기관 페이지
  let organizationRoutes: MetadataRoute.Sitemap = []
  try {
    const orgsRes = await fetch(`${env.NEXT_PUBLIC_API_URL}/organizations?size=1000`, {
      next: { revalidate: 3600 },
    })
    if (orgsRes.ok) {
      const orgsData = await orgsRes.json()
      const organizations: OrganizationListItem[] = orgsData.content || orgsData || []
      organizationRoutes = organizations.map(org => ({
        url: `${env.NEXT_PUBLIC_BASE_URL}/organizations/${org.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    }
  } catch {
    // API 에러 시 빈 배열 유지
  }

  // 동적 커뮤니티 게시글 페이지
  let postRoutes: MetadataRoute.Sitemap = []
  try {
    const postsRes = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts?size=1000`, {
      next: { revalidate: 3600 },
    })
    if (postsRes.ok) {
      const postsData = await postsRes.json()
      const posts: PostListItem[] = postsData.content || []
      postRoutes = posts.map(post => ({
        url: `${env.NEXT_PUBLIC_BASE_URL}/community/${post.id}`,
        lastModified: post.createdAt ? new Date(post.createdAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      }))
    }
  } catch {
    // API 에러 시 빈 배열 유지
  }

  return [...staticRoutes, ...lectureRoutes, ...organizationRoutes, ...postRoutes]
}
