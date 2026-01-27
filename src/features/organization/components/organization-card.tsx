import Image from 'next/image'
import Link from 'next/link'

import type { OrganizationSummary } from '../types/organization.type'

interface OrganizationCardProps {
  organization: OrganizationSummary
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  const hasRecruiting = organization.recruitingLectureCount > 0

  return (
    <Link href={`/organizations/${organization.id}`} className="group block">
      {/* Mobile: 세로 레이아웃 */}
      <div className="flex flex-col gap-4 rounded-xl bg-card p-4 shadow-[4px_4px_15px_0px_rgba(161,161,170,0.25)] transition-all duration-200 hover:shadow-[4px_4px_20px_0px_rgba(161,161,170,0.35)] md:hidden">
        {/* Top Section: Logo + Info */}
        <div className="flex items-center gap-2">
          {/* Logo - 원형 */}
          <div className="relative flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-2.5 shadow-[2px_2px_10px_0px_rgba(161,161,170,0.25)]">
            {organization.logoUrl ? (
              <Image
                src={organization.logoUrl}
                alt={organization.name}
                fill
                sizes="50px"
                className="object-contain p-2"
              />
            ) : (
              <span className="text-xl">🏢</span>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            {/* Organization Name */}
            <p className="truncate text-sm font-semibold text-foreground">{organization.name}</p>

            {/* Description */}
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{organization.description}</p>
          </div>
        </div>

        {/* Bottom Section: Recruiting Badge */}
        <div className="flex justify-center">
          {hasRecruiting ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-4 py-2 text-xs text-foreground">
              <span className="h-1 w-1 rounded-full bg-amber-500" />
              {organization.recruitingLectureCount}개 교육과정 모집 중
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground">
              아직 모집 중인 과정이 없어요.
            </span>
          )}
        </div>
      </div>

      {/* Desktop: 가로 레이아웃 (피그마 디자인) */}
      <div className="hidden h-[90px] items-center rounded-xl bg-card px-5 shadow-[4px_4px_15px_0px_rgba(161,161,170,0.25)] transition-all duration-200 hover:shadow-[4px_4px_20px_0px_rgba(161,161,170,0.35)] md:flex">
        {/* Logo */}
        <div className="relative flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[2px_2px_10px_0px_rgba(161,161,170,0.25)]">
          {organization.logoUrl ? (
            <Image
              src={organization.logoUrl}
              alt={organization.name}
              fill
              sizes="50px"
              className="object-contain p-2"
            />
          ) : (
            <span className="text-xl">🏢</span>
          )}
        </div>

        {/* Info - 가로 배치 */}
        <div className="ml-3 min-w-0 flex-1">
          {/* Organization Name */}
          <p className="truncate text-base font-semibold text-foreground">{organization.name}</p>
          {/* Description */}
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{organization.description}</p>
        </div>

        {/* Recruiting Badge - 우측 */}
        <div className="ml-4 flex-shrink-0">
          {hasRecruiting ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-4 py-2 text-sm text-foreground">
              <span className="h-1 w-1 rounded-full bg-amber-500" />
              {organization.recruitingLectureCount}개 교육과정 모집 중
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-sm text-muted-foreground">
              아직 모집 중인 과정이 없어요.
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
