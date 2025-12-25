import { AdminSidebar, MemberPage } from '@/features/admin'

export default function AdminMembersPage() {
  return (
    <>
      <div className="custom-container">
        <div className="custom-card flex gap-6">
          <AdminSidebar />
          <MemberPage />
        </div>
      </div>
    </>
  )
}
