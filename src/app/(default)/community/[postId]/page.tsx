import { Suspense } from 'react'

import type { Metadata } from 'next'
import { cookies } from 'next/headers'

import { JsonLd, createArticleJsonLd } from '@/components/seo/json-ld'
import { mapApiPostDetailToPostDetail } from '@/features/community/api/post-api.client'
import type { ApiPostDetailResponse } from '@/features/community/api/post-api.types'
import { env } from '@/lib/env'

import PostDetailContent from './post-detail-content'

interface PostDetailPageProps {
  params: Promise<{
    postId: string
  }>
}

async function getPost(postId: string, cookieHeader?: string) {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
      next: { revalidate: 60 },
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
    })
    if (!res.ok) return null
    return res.json() as Promise<ApiPostDetailResponse>
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { postId } = await params
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const post = await getPost(postId, cookieHeader)

  if (!post) {
    return {
      title: '게시글',
    }
  }

  const postTitle = post.title || '게시글'
  // HTML 태그 제거 및 150자로 자르기
  const plainBody = post.body?.replace(/<[^>]*>/g, '') || ''
  const postDescription = plainBody.length > 150 ? `${plainBody.slice(0, 150)}...` : plainBody

  return {
    title: postTitle,
    description: postDescription || '소프트웨어캠퍼스 커뮤니티 게시글입니다.',
    alternates: {
      canonical: `${env.NEXT_PUBLIC_BASE_URL}/community/${postId}`,
    },
    openGraph: {
      title: `${postTitle} | 소프트웨어캠퍼스`,
      description: postDescription || '소프트웨어캠퍼스 커뮤니티 게시글입니다.',
      type: 'article',
      authors: [post.authorNickname || '익명'],
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      url: `${env.NEXT_PUBLIC_BASE_URL}/community/${postId}`,
    },
  }
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = await params
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.toString()
  const post = await getPost(postId, cookieHeader)

  // 서버에서 가져온 데이터를 클라이언트 형식으로 변환
  const initialData = post ? mapApiPostDetailToPostDetail(post) : undefined

  // HTML 태그 제거
  const plainBody = post?.body?.replace(/<[^>]*>/g, '') || ''
  const description = plainBody.length > 150 ? `${plainBody.slice(0, 150)}...` : plainBody

  const articleJsonLd = post
    ? createArticleJsonLd({
        headline: post.title || '게시글',
        description: description || undefined,
        author: post.authorNickname || '익명',
        datePublished: post.createdAt,
        dateModified: post.updatedAt,
        url: `${env.NEXT_PUBLIC_BASE_URL}/community/${postId}`,
        image: post.images?.[0],
      })
    : null

  return (
    <>
      {articleJsonLd && <JsonLd data={articleJsonLd} />}
      <Suspense fallback={null}>
        <PostDetailContent postId={Number(postId)} initialData={initialData} />
      </Suspense>
    </>
  )
}
