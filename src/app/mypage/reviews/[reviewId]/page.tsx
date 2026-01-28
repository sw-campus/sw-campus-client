import { notFound } from 'next/navigation'

import { ReviewEditClient } from './review-edit-client'

interface ReviewEditPageProps {
  params: Promise<{ reviewId: string }>
}

export default async function ReviewEditPage({ params }: ReviewEditPageProps) {
  const { reviewId } = await params
  const id = Number(reviewId)

  // 유효하지 않은 ID인 경우 404 반환
  if (isNaN(id) || id <= 0) {
    notFound()
  }

  return <ReviewEditClient reviewId={id} />
}
