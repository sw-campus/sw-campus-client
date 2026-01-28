import { AdminSidebar, OrganizationApprovalPage } from '@/features/admin'

export default function AdminOrganizationMembersPage() {
  return (
    <div className="page-container custom-container">
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <AdminSidebar />
        <OrganizationApprovalPage />
      </div>
    </div>
  )
}
