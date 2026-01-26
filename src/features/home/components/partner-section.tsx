'use client'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useOrganizationsQuery } from '@/features/organization/hooks/use-organizations'

export function PartnerSection() {
  const { data: organizations, isLoading } = useOrganizationsQuery()

  const displayPartners = organizations?.slice(0, 8) ?? []
  const totalCount = organizations?.length ?? 0

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6 px-4 py-[30px] md:custom-container">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold md:text-2xl">협력 중인 훈련 기관을 확인 해보세요.</h2>
          <p className="text-sm text-muted-foreground">로딩 중...</p>
        </div>
        <div className="flex h-32 items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6 px-4 py-[30px] md:custom-container">
      {/* 섹션 헤더 */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold md:text-2xl">협력 중인 훈련 기관을 확인 해보세요.</h2>
        <p className="text-sm text-muted-foreground">
          SOFTWARE CAMPUS와 협력한 {totalCount}곳의 훈련 기관에서 진행하는 부트캠프를 확인해보세요.
        </p>
      </div>

      {/* 파트너 카드 목록 */}
      {displayPartners.length > 0 ? (
        <>
          {/* 모바일: 가로 스크롤 */}
          <div className="scrollbar-hide flex gap-3 overflow-x-auto md:hidden">
            {displayPartners.slice(0, 4).map((partner, index) => (
              <PartnerCard key={partner.organizationId ?? `partner-${index}`} partner={partner} />
            ))}
          </div>
          {/* 데스크톱: 그리드 6열 */}
          <div className="hidden md:grid md:grid-cols-6 md:gap-4">
            {displayPartners.map((partner, index) => (
              <PartnerCard key={partner.organizationId ?? `partner-${index}`} partner={partner} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          등록된 훈련 기관이 없습니다.
        </div>
      )}

      {/* 전체보기 버튼 */}
      <Button variant="outline" className="w-full gap-2" asChild>
        <Link href="/organizations">
          훈련 기관 더보기
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  )
}

interface PartnerCardProps {
  partner: {
    organizationId: number
    organizationName: string
    logoUrl?: string
  }
}

function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <Link href={`/organizations/${partner.organizationId}`}>
      <Card className="w-[140px] shrink-0 border shadow-sm transition-shadow hover:shadow-md md:w-auto">
        <CardContent className="flex flex-col items-center gap-2 p-3">
          {/* 로고 */}
          <div className="relative flex size-16 items-center justify-center rounded-lg bg-muted">
            {partner.logoUrl ? (
              <Image
                src={partner.logoUrl}
                alt={partner.organizationName}
                fill
                className="object-contain p-2"
              />
            ) : (
              <span className="text-2xl text-muted-foreground">🏢</span>
            )}
          </div>

          {/* 기관명 */}
          <p className="line-clamp-2 text-center text-xs font-medium">{partner.organizationName}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
