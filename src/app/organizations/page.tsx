import HeaderSection from '@/components/layout/header/HeaderSection'
import { MOCK_ORGS } from '@/features/organization/api/mockOrganizations'
import { OrganizationList } from '@/features/organization/components/OrganizationList'

export default function OrganizationsPage() {
  return (
    <>
      <HeaderSection />
      <main className="min-h-screen pt-20">
        <div className="custom-container">
          <div className="custom-card">
            <OrganizationList organizations={MOCK_ORGS} />
          </div>
        </div>
      </main>
    </>
  )
}
