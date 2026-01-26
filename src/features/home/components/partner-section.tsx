'use client'

import { MoreVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useOrganizationsQuery } from '@/features/organization/hooks/use-organizations'

export function PartnerSection() {
  const { data: organizations, isLoading } = useOrganizationsQuery()

  const displayPartners = organizations?.slice(0, 10) ?? []
  const totalCount = organizations?.length ?? 0

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6 px-4 py-[30px] md:mx-auto md:w-full md:max-w-[1448px] md:gap-10 md:px-6 md:py-[50px]">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="text-xl font-bold md:text-[32px]">
            협력 중인 <span className="text-brand-gold">훈련 기관</span>을 확인 해보세요.
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">로딩 중...</p>
        </div>
        <div className="flex h-32 items-center justify-center">
          <div className="border-muted border-t-primary size-8 animate-spin rounded-full border-4" />
        </div>
      </section>
    )
  }

  return (
    <section className="flex flex-col gap-6 px-4 py-[30px] md:mx-auto md:w-full md:max-w-[1448px] md:gap-10 md:px-6 md:py-[50px]">
      {/* 섹션 헤더 */}
      <div className="flex flex-col gap-3 text-center md:gap-4">
        <h2 className="text-xl font-bold md:text-[32px]">
          협력 중인 <span className="text-brand-gold">훈련 기관</span>을 확인 해보세요.
        </h2>
        <p className="text-muted-foreground text-base md:text-lg">
          소프트웨어 캠퍼스와 협력한 {totalCount}곳의 훈련 기관에서 진행하는 부트캠프를 확인해보세요.
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
              <MoreVertical className="text-muted-foreground size-8" />
            </Link>
          </div>
          {/* 데스크톱: 5열 x 2행 지그재그 배치 */}
          <div className="hidden flex-col items-center gap-6 md:flex">
            <div className="flex justify-center gap-6">
              {/* 1열 - 아래로 밀림 */}
              <div className="flex flex-col gap-6 pt-12">
                <PartnerCard partner={displayPartners[0]} />
                <PartnerCard partner={displayPartners[1]} />
              </div>
              {/* 2열 - 위로 밀림 */}
              <div className="flex flex-col gap-6 pb-12">
                <PartnerCard partner={displayPartners[2]} />
                <PartnerCard partner={displayPartners[3]} />
              </div>
              {/* 3열 - 아래로 밀림 */}
              <div className="flex flex-col gap-6 pt-12">
                <PartnerCard partner={displayPartners[4]} />
                <PartnerCard partner={displayPartners[5]} />
              </div>
              {/* 4열 - 위로 밀림 */}
              <div className="flex flex-col gap-6 pb-12">
                <PartnerCard partner={displayPartners[6]} />
                <PartnerCard partner={displayPartners[7]} />
              </div>
              {/* 5열 - 아래로 밀림 */}
              <div className="flex flex-col gap-6 pt-12">
                <PartnerCard partner={displayPartners[8]} />
                {displayPartners[9] && <PartnerCard partner={displayPartners[9]} />}
              </div>
            </div>
            {/* 더보기 아이콘 - 카드 아래 중앙 */}
            <Link href="/organizations" className="flex items-center justify-center">
              <MoreVertical className="size-8 text-foreground" />
            </Link>
          </div>
        </>
      ) : (
        <div className="text-muted-foreground flex h-32 items-center justify-center">등록된 훈련 기관이 없습니다.</div>
      )}

      {/* 전체보기 버튼 */}
      <Button variant="outline" className="mx-auto h-auto min-w-[320px] gap-2 rounded-full px-8 py-4 text-base" asChild>
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
      <div className="bg-brand-gold-light flex h-[140px] w-full flex-col items-center justify-center gap-4 rounded-xl p-4 shadow-[4px_4px_15px_rgba(161,161,170,0.25)] transition-shadow hover:shadow-md md:h-[190px] md:w-[260px] md:gap-4 md:p-4">
        {/* 로고 - 흰색 원형 배경 */}
        <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-white shadow-[4px_4px_10px_rgba(161,161,170,0.25)] md:size-[100px] md:p-2.5">
          {partner.logoUrl ? (
            <Image src={partner.logoUrl} alt={partner.name} width={80} height={80} className="object-contain" />
          ) : (
            <span className="text-3xl md:text-4xl">🏢</span>
          )}
        </div>

        {/* 기관명 */}
        <p className="line-clamp-2 w-full text-center text-sm font-medium break-keep md:text-base">{partner.name}</p>
      </div>
    </Link>
  )
}
