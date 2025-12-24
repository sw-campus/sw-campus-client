'use client'

import { useEffect, useState } from 'react'

import { LuBuilding, LuKey, LuPencil } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/axios'
import { cn } from '@/lib/utils'

import { PasswordChangeModal } from '../PasswordChangeModal'
import { PasswordVerifyModal } from '../PasswordVerifyModal'

type MyOrganizationResponse = {
  organizationId: number
  organizationName: string
  description: string
  representativeName: string
  phone: string
  location: string
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | string
  certificateKey: string
  govAuth: string
  homepage: string
  logoUrl: string
  nickname: string
}

type OrganizationCardProps = {
  onEditClick: () => void
}

export function OrganizationCard({ onEditClick }: OrganizationCardProps) {
  const [org, setOrg] = useState<MyOrganizationResponse | null>(null)
  const [loading, setLoading] = useState(true)

  // Modals
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadOrg = async () => {
      try {
        setLoading(true)
        const { data } = await api.get<MyOrganizationResponse>('/mypage/organization')
        if (mounted) setOrg(data)
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadOrg()
    return () => {
      mounted = false
    }
  }, [])

  const handleEditAttempt = () => {
    setVerifyModalOpen(true)
  }

  const getStatusLabel = (status: string) => {
    const s = status.toUpperCase()
    switch (s) {
      case 'APPROVED':
        return '승인됨'
      case 'PENDING':
        return '승인 대기'
      case 'REJECTED':
        return '반려됨'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase()
    switch (s) {
      case 'APPROVED':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'PENDING':
        return 'text-amber-600 bg-amber-50 border-amber-200'
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <>
      <Card className="h-full bg-white/60 shadow-sm ring-1 ring-white/30 backdrop-blur-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
              <LuBuilding className="h-4 w-4" />
            </div>
            <CardTitle className="text-foreground text-lg">기업 정보</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground h-8 gap-1.5"
              onClick={handleEditAttempt}
            >
              <LuPencil className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">수정</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <span className="text-muted-foreground text-sm">불러오는 중...</span>
            </div>
          ) : org ? (
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
              {/* Logo Area */}
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border bg-white p-2 shadow-sm">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt="logo" className="h-full w-full object-contain" />
                  ) : (
                    <span className="text-muted-foreground text-xs">No Logo</span>
                  )}
                </div>
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                    getStatusColor(org.approvalStatus),
                  )}
                >
                  {getStatusLabel(org.approvalStatus)}
                </div>
              </div>

              {/* Info Area */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{org.organizationName}</h3>
                  {org.nickname && <p className="text-primary font-medium">{org.nickname}</p>}
                  <p className="mt-1 text-sm text-gray-500">{org.description || '기관 소개가 없습니다.'}</p>
                </div>

                <div className="grid gap-3 border-t pt-4">
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <span className="w-20 shrink-0 text-sm font-medium text-gray-500">대표자</span>
                    <span className="text-sm text-gray-900">{org.representativeName}</span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <span className="w-20 shrink-0 text-sm font-medium text-gray-500">연락처</span>
                    <span className="text-sm text-gray-900">{org.phone}</span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <span className="w-20 shrink-0 text-sm font-medium text-gray-500">주소</span>
                    <span className="text-sm text-gray-900">{org.location}</span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                    <span className="w-20 shrink-0 text-sm font-medium text-gray-500">홈페이지</span>
                    <span className="text-sm text-gray-900">
                      {org.homepage ? (
                        <a
                          href={org.homepage}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {org.homepage}
                        </a>
                      ) : (
                        '-'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center">
              <span className="text-muted-foreground text-sm">기관 정보를 불러올 수 없습니다.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <PasswordVerifyModal open={verifyModalOpen} onOpenChange={setVerifyModalOpen} onVerified={onEditClick} />
    </>
  )
}
