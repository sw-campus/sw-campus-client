import { notFound } from 'next/navigation';
import HeaderSection from "@/components/layout/header/HeaderSection";
import { OrganizationDetail } from "@/features/organization/components/OrganizationDetail";
import { MOCK_ORGS } from "@/features/organization/api/mockOrganizations";
import { mockCourses } from "@/features/course/api/mockCourses";

interface OrganizationDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrganizationDetailPage({ params }: OrganizationDetailPageProps) {
    const { id } = await params;
    const orgId = parseInt(id, 10);

    // Find organization by ID
    const organization = MOCK_ORGS.find(org => org.id === orgId);

    if (!organization) {
        notFound();
    }

    // Filter courses by organization name (mock implementation)
    // In real app, this would be an API call
    const organizationCourses = mockCourses.filter(
        course => course.organization === organization.name
    );

    return (
        <>
            <HeaderSection />
            <main className="min-h-screen pt-20">
                <div className="custom-container">
                    <div className="custom-card">
                        <OrganizationDetail
                            organization={organization}
                            courses={organizationCourses}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}
