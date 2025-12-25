import Image from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/ui/card'

import type { OrganizationSummary } from '../types/organization.type'

interface OrganizationCardProps {
  organization: OrganizationSummary
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  // 이름/로고 문자열 기반 Hue 산출 → 밝은 파스텔 톤 생성
  const getHue = (input: string) => {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash)
    }
    return Math.abs(hash) % 360
  }
  const h = getHue(organization.logoUrl || organization.name)
  const accentCircleBg = `hsla(${h}, 70%, 90%, 0.55)`
  const cardGradStart = `hsla(${h}, 70%, 93%, 0.55)`
  const cardGradEnd = `hsla(${h}, 70%, 88%, 0.35)`
  const tagBg = `hsla(${h}, 70%, 80%, 0.35)`
  const tagDotBg = `hsla(${h}, 70%, 55%, 0.9)`

  return (
    <Link href={`/organizations/${organization.id}`} className="group block">
      <Card
        className="flex h-full flex-col items-center rounded-2xl p-5 text-center shadow-sm ring-1 ring-white/30 backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
        style={{ backgroundImage: `linear-gradient(180deg, ${cardGradStart}, ${cardGradEnd})` }}
      >
        {/* Circular Logo with Ring */}
        <div
          className="ring-border group-hover:ring-primary/30 relative mb-4 flex h-18 w-18 items-center justify-center overflow-hidden rounded-full shadow-sm ring-2 transition-all group-hover:shadow-md"
          style={{ backgroundColor: accentCircleBg }}
        >
          {organization.logoUrl ? (
            <Image
              src={organization.logoUrl}
              alt={organization.name}
              fill
              sizes="72px"
              className="object-cover object-center"
            />
          ) : (
            <span className="text-2xl">🏢</span>
          )}
        </div>

        {/* Organization Name */}
        <h3 className="text-foreground mb-1.5 text-base font-semibold">{organization.name}</h3>

        {/* Description */}
        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm leading-relaxed">{organization.description}</p>

        {/* Recruiting Badge - 모집 중 태그 */}
        {organization.recruitingLectureCount > 0 && (
          <span
            className="mt-auto inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium shadow-sm"
            style={{ backgroundColor: tagBg }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tagDotBg }} />
            {organization.recruitingLectureCount}개 교육과정 모집중
          </span>
        )}
      </Card>
    </Link>
  )
}
