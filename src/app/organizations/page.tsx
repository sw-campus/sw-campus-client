import { OrganizationList } from "@/features/organization/components/OrganizationList";
import Header from "@/components/layout/Header";

export default function OrganizationsPage() {
    return (
        <>
            <Header />
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
