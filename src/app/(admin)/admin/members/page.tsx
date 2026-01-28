import { AdminSidebar, MemberPage } from '@/features/admin'

export default function AdminMembersPage() {
  return (
    <div className="page-container custom-container">
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        <AdminSidebar />
        <MemberPage />
      </div>
    </div>
  )
}
