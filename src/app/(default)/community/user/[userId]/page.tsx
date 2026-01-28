import { notFound } from 'next/navigation'

import { UserProfileClient } from './user-profile-client'

interface UserProfilePageProps {
  params: Promise<{ userId: string }>
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { userId } = await params
  const id = Number(userId)

  // 유효하지 않은 ID인 경우 404 반환
  if (isNaN(id) || id <= 0) {
    notFound()
  }

  return <UserProfileClient userId={id} />
}
