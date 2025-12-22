import { AdminSidebar, OrganizationApprovalPage } from '@/features/admin'

export default function AdminOrganizationMembersPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex gap-6">
          <AdminSidebar />
          <OrganizationApprovalPage />
        </div>
      </div>
    </>
  )
}
