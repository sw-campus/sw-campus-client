import { notFound } from 'next/navigation';
import HeaderSection from "@/components/layout/header/HeaderSection";
import { OrganizationDetailPageClient } from "@/features/organization/components/OrganizationDetailPageClient";

interface OrganizationDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrganizationDetailPage({ params }: OrganizationDetailPageProps) {
    const { id } = await params;
    const orgId = parseInt(id, 10);

    // 유효하지 않은 ID인 경우 404 반환
    if (isNaN(orgId) || orgId <= 0) {
        notFound();
    }

    return (
        <>
            <HeaderSection />
            <main className="min-h-screen pt-20">
                <div className="custom-container">
                    <div className="custom-card">
                        <OrganizationDetailPageClient organizationId={orgId} />
                    </div>
                </div>
            </main>
        </>
    );
}
