'use client'

import { ArrowRight, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useOrganizationsQuery } from '@/features/organization/hooks/use-organizations'

export function PartnerSection() {
  const { data: organizations, isLoading } = useOrganizationsQuery()

  const displayPartners = organizations?.slice(0, 8) ?? []
  const totalCount = organizations?.length ?? 0

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6 px-4 py-[30px] md:custom-container">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold md:text-2xl">협력 중인 <span className="text-brand-gold">훈련 기관</span>을 확인 해보세요.</h2>
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
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-xl font-bold md:text-2xl">협력 중인 <span className="text-brand-gold">훈련 기관</span>을 확인 해보세요.</h2>
        <p className="text-sm text-muted-foreground">
          소프트웨어 캠퍼스와 협력한 {totalCount}곳의 훈련 기관에서
          <br />
          진행하는 부트캠프를 확인해보세요.
        </p>
      </div>

      {/* 파트너 카드 목록 */}
      {displayPartners.length > 0 ? (
        <>
          {/* 모바일: 2x2 그리드 + 아래 더보기 아이콘 */}
          <div className="flex flex-col items-center gap-4 md:hidden">
            <div className="grid w-full grid-cols-2 gap-4">
              {displayPartners.slice(0, 4).map((partner, index) => (
                <PartnerCard key={partner.id ?? `partner-${index}`} partner={partner} />
              ))}
            </div>
            <Link href="/organizations" className="flex items-center justify-center">
              <MoreVertical className="size-8 text-muted-foreground" />
            </Link>
          </div>
          {/* 데스크톱: 그리드 6열 */}
          <div className="hidden md:grid md:grid-cols-6 md:gap-4">
            {displayPartners.map((partner, index) => (
              <PartnerCard key={partner.id ?? `partner-${index}`} partner={partner} />
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          등록된 훈련 기관이 없습니다.
        </div>
      )}

      {/* 전체보기 버튼 */}
      <Button variant="outline" className="mx-auto h-auto min-w-[280px] gap-2 rounded-full py-3" asChild>
        <Link href="/organizations">훈련 기관 더보기</Link>
      </Button>
    </section>
  )
}

interface PartnerCardProps {
  partner: {
    id: number
    name: string
    logoUrl: string | null
  }
}

function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <Link href={`/organizations/${partner.id}`}>
      <div className="flex h-[115px] flex-col items-center justify-center gap-3 rounded-xl bg-brand-gold-light p-4 shadow-[4px_4px_15px_rgba(161,161,170,0.25)] transition-shadow hover:shadow-md">
        {/* 로고 - 흰색 원형 배경 */}
        <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
          {partner.logoUrl ? (
            <Image
              src={partner.logoUrl}
              alt={partner.name}
              width={40}
              height={40}
              className="object-contain"
            />
          ) : (
            <span className="text-2xl">🏢</span>
          )}
        </div>

        {/* 기관명 - 2줄 높이 고정 */}
        <p
          className={`flex h-8 w-full items-center justify-center break-keep text-center font-medium ${
            partner.name.length > 10
              ? 'text-[9px]'
              : partner.name.length > 6
                ? 'text-[10px]'
                : 'text-xs'
          }`}
        >
          {partner.name}
        </p>
      </div>
    </Link>
  )
}
