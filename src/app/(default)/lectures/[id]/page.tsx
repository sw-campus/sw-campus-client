import { Metadata } from 'next'

import { JsonLd, createLectureJsonLd } from '@/components/seo/json-ld'
import { mapApiLectureDetailToLectureDetail } from '@/features/lecture/api/lecture-api.mapper'
import type { ApiLectureDetail } from '@/features/lecture/api/lecture-api.types'
import LectureDetailPage from '@/features/lecture/components/lecture-detail-page'
import { env } from '@/lib/env'

type Props = {
  params: Promise<{ id: string }>
}

async function getLecture(id: string) {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/lectures/${id}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json() as Promise<ApiLectureDetail>
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const lecture = await getLecture(id)

  if (!lecture) {
    return {
      title: '강의 상세',
    }
  }

  const lectureName = lecture.lectureName || '강의 상세'
  const description = lecture.goal || '소프트웨어캠퍼스에서 제공하는 강의입니다.'

  return {
    title: lectureName,
    description,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_BASE_URL}/lectures/${id}`,
    },
    openGraph: {
      title: `${lectureName} | 소프트웨어캠퍼스`,
      description,
      type: 'website',
      url: `${env.NEXT_PUBLIC_BASE_URL}/lectures/${id}`,
    },
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const lecture = await getLecture(id)

  // 서버에서 가져온 데이터를 클라이언트 형식으로 변환
  const initialData = lecture ? mapApiLectureDetailToLectureDetail(lecture) : undefined

  const lectureJsonLd = lecture
    ? createLectureJsonLd({
        name: lecture.lectureName || '강의',
        description: lecture.goal,
        provider: lecture.orgName || '소프트웨어캠퍼스',
        url: `${env.NEXT_PUBLIC_BASE_URL}/lectures/${id}`,
      })
    : null

  return (
    <>
      {lectureJsonLd && <JsonLd data={lectureJsonLd} />}
      <LectureDetailPage lectureId={id} initialData={initialData} />
    </>
  )
}
