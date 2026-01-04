'use client'

import { useRouter } from 'next/navigation'
import { FiEdit3 } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfileCard } from '@/features/mypage/components/ProfileCard'

export default function AdminMyPage() {
  const router = useRouter()

  const handleEditProfile = () => {
    router.push('/mypage/admin/info')
  }

  return (
    <div className="custom-container">
      <div className="custom-card">
        <div className="flex flex-1 flex-col gap-6">
          {/* Header */}
          <div>
            <h1 className="text-foreground text-2xl font-bold">관리자 마이페이지</h1>
            <p className="text-muted-foreground mt-1 text-sm">내 정보를 관리하세요</p>
          </div>

          {/* Profile Card with Edit Button */}
          <ProfileCard onEditClick={handleEditProfile} />
        </div>
      </div>
    </div>
  )
}
