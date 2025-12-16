import { OrganizationList } from "@/features/organization/components/OrganizationList";
import HeaderSection from "@/components/layout/header/HeaderSection";

export default function OrganizationsPage() {
    return (
        <>
            <HeaderSection />
            <main className="min-h-screen pt-20">
                <div className="custom-container">
                    <div className="custom-card">
                        <OrganizationList />
                    </div>
                </div>
            </main>
        </>
    );
}