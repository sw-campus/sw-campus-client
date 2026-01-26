import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { JsonLd, createOrganizationJsonLd } from '@/components/seo/json-ld'
import { OrganizationDetailPageClient } from '@/features/organization/components/organization-detail-page-client'
import type { OrganizationDetail } from '@/features/organization/types/organization.type'
import { env } from '@/lib/env'

interface OrganizationDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getOrganization(id: string): Promise<OrganizationDetail | null> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/organizations/${id}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: OrganizationDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const organization = await getOrganization(id)

  if (!organization) {
    return {
      title: '교육기관 상세',
    }
  }

  const orgName = organization.name || '교육기관'
  const orgDescription = organization.description || '소프트웨어캠퍼스에서 제공하는 교육기관 정보입니다.'

  return {
    title: orgName,
    description: orgDescription,
    alternates: {
      canonical: `${env.NEXT_PUBLIC_BASE_URL}/organizations/${id}`,
    },
    openGraph: {
      title: `${orgName} | 소프트웨어캠퍼스`,
      description: orgDescription,
      images: organization.logoUrl ? [{ url: organization.logoUrl }] : undefined,
      url: `${env.NEXT_PUBLIC_BASE_URL}/organizations/${id}`,
    },
  }
}

export default async function OrganizationDetailPage({ params }: OrganizationDetailPageProps) {
  const { id } = await params
  const orgId = parseInt(id, 10)

  // 유효하지 않은 ID인 경우 404 반환
  if (isNaN(orgId) || orgId <= 0) {
    notFound()
  }

  const organization = await getOrganization(id)

  const orgJsonLd = organization
    ? createOrganizationJsonLd({
        name: organization.name || '교육기관',
        description: organization.description ?? undefined,
        url: `${env.NEXT_PUBLIC_BASE_URL}/organizations/${id}`,
        logo: organization.logoUrl ?? undefined,
      })
    : null

  return (
    <>
      {orgJsonLd && <JsonLd data={orgJsonLd} />}
      <div className="custom-container">
        <OrganizationDetailPageClient organizationId={orgId} initialData={organization ?? undefined} />
      </div>
    </>
  )
}
