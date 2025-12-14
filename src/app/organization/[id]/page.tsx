import HeaderSection from "@/components/layout/header/HeaderSection";
import { OrganizationDetailPageClient } from "@/features/organization/components/OrganizationDetailPageClient";
import { mockCourses } from "@/features/course/api/mockCourses";
import { MOCK_ORG_DETAILS } from "@/features/organization/api/mockOrganizations";

interface OrganizationDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrganizationDetailPage({ params }: OrganizationDetailPageProps) {
    const { id } = await params;
    const orgId = parseInt(id, 10);

    // Mock 데이터에서 기관 이름 가져오기 (courses 필터링용)
    const mockOrg = MOCK_ORG_DETAILS.find(org => org.id === orgId);

    // Filter courses by organization name (mock implementation)
    const organizationCourses = mockOrg
        ? mockCourses.filter(course => course.organization === mockOrg.name)
        : [];

    return (
        <>
            <HeaderSection />
            <main className="min-h-screen pt-20">
                <div className="custom-container">
                    <div className="custom-card">
                        <OrganizationDetailPageClient
                            organizationId={orgId}
                            mockCourses={organizationCourses}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
