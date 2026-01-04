import { Metadata } from 'next'

import LectureDetailPage from '@/features/lecture/components/LectureDetailPage'
import { env } from '@/lib/env'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/lectures/${id}`, {
      next: { revalidate: 60 }, // 60초 캐시
    })

    if (!res.ok) {
      return {
        title: '강의 상세 | 소프트웨어캠퍼스',
      }
    }

    const lecture = await res.json()
    const lectureName = lecture?.lectureName || '강의 상세'

    return {
      title: `${lectureName} | 소프트웨어캠퍼스`,
      description: lecture?.goal || '소프트웨어캠퍼스에서 제공하는 강의입니다.',
    }
  } catch {
    return {
      title: '강의 상세 | 소프트웨어캠퍼스',
    }
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <LectureDetailPage lectureId={id} />
}
