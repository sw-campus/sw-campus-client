import Image from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/ui/card'

import type { OrganizationSummary } from '../types/organization.type'

interface OrganizationCardProps {
  organization: OrganizationSummary
}

export function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <Link href={`/organization/${organization.id}`} className="group block">
      <Card className="bg-card/40 flex h-full flex-col items-center border-0 p-5 text-center shadow-sm backdrop-blur-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
        {/* Circular Logo with Ring */}
        <div className="bg-card ring-border group-hover:ring-primary/30 mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-sm ring-2 transition-all group-hover:shadow-md">
          {organization.logoUrl ? (
            <Image
              src={organization.logoUrl}
              alt={organization.name}
              width={64}
              height={64}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <span className="text-2xl">🏢</span>
          )}
        </div>

        {/* Organization Name */}
        <h3 className="text-foreground mb-1.5 text-base font-semibold">{organization.name}</h3>

        {/* Description */}
        <p className="text-muted-foreground mb-3 line-clamp-2 text-sm leading-relaxed">{organization.description}</p>

        {/* Recruiting Badge - Green semantic color */}
        {organization.recruitingLectureCount > 0 && (
          <span className="bg-accent/20 text-accent-foreground mt-auto inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
            <span className="bg-accent h-1.5 w-1.5 rounded-full" />
            {organization.recruitingLectureCount}개 모집 중
          </span>
        )}
      </Card>
    </Link>
  )
}
